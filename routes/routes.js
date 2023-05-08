import { Router } from "express";
import { pool } from "../dbConfig.js";
import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "express-flash";
import bcrypt from 'bcrypt';
import hbs from 'hbs';
import methodOverride from 'method-override'
import multer from 'multer';
import fs from 'fs';

const router = Router()

import initializePassport from "../passportConfig.js";


initializePassport(passport);

router.use(express.urlencoded({ extended: false })); // MIDDLEWARE para enviar los datos del frontend al backend

router.use(bodyParser.urlencoded({ extended: true }))

router.use(cookieParser("secretKey"))

router.use(session({
  secret: "secretKey",
  saveUninitialized: false,
  resave: false

}))

// Funtion inside passport which initializes passport
router.use(passport.initialize());
// Store our variables to be persisted across the whole session. Works with app.use(Session) above
router.use(passport.session());

router.use(flash());

router.use(passport.initialize())
router.use(passport.session())

router.use(methodOverride("_method", { methods: ["GET", "POST"] }));

// SUBIR AVATAR USERS


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img/')
  },
  filename: function (req, file, cb) {
    const userId = req.params.id;
    const ext = file.originalname.split('.').pop();
    const filename = userId + '.' + ext;
    const filepath = 'public/img/' + filename;
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
    cb(null, filename);
  }
});

const upload = multer({ storage: storage })

router.post('/users/:id/avatar', upload.single('avatar'), function (req, res, next) {
  // req.file contains information about the uploaded file
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a file' });
  }

  const avatarFilename = req.file.filename;
  const avatarUrl = '/img/' + avatarFilename;

  return res.json({ message: 'File uploaded successfully', avatarUrl });
})


// RUTAS

router.get("/", (req, res) => {
  res.render("index", { "titulo": "Página Personal" })
})

router.get("/users/login", checkAuthenticated, async (req, res) => {
  const resultado = await fetch("http://localhost:4000/api/v1/users");
  const data = await resultado.json();
  res.render("login", { "users": data });
});

router.get("/users/registro", checkAuthenticated, (req, res) => {
  res.render("registro")
})

router.get("/mapa", checkNotAuthenticated, (req, res) => {
  res.render("mapa")
})


router.get("/users/carto",checkNotAuthenticated, (req, res) => {
  // console.log(req.isAuthenticated());
  res.render("carto", { user: req.user })
})

router.get("/admin/landing", checkNotAuthenticated, checkCategoria1, (req, res) => {
  res.render("landingadmin", { user: req.user })
})

router.get("/admin/colab", checkNotAuthenticated, checkCategoria2, (req, res) => {
  res.render("landingcolab", { user: req.user })
})

router.get("/users/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      // Handle error, if any
      console.error(err);
    }
    res.render("login", { message: "Te has desconectado" });
    res.redirect("/users/login");
  });
});

router.get("/profile",checkNotAuthenticated, (req, res) => {
  // console.log(req.isAuthenticated());
  res.render("profile", { user: req.user })
})


// Registro Usuarios

router.post("/registro", async (req, res) => {
  const { name, email, password } = req.body;

  let errors = [];

  if (!name || !email || !password) {
    errors.push("Please enter all fields");
  }

  if (password.length < 6) {
    errors.push("La contraseña debe tener al menos de 6 caracteres");
  }

  // Validate email format using regular expression
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    errors.push("Por favor ingrese un email válido");
  }

  try {
    // Check if email already exists in database
    const datos = await fetch("http://localhost:4000/api/v1/users3");
    const data = await datos.json();
    const userExists = data.some((user) => user.email === email);
    if (userExists) {
      errors.push("El email ingresado ya existe en nuestros registros");
    }

    if (errors.length > 0) {
      return res.render("registro", { errors, name, email, password });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userResponse = await fetch("http://localhost:4000/api/v1/users3", {
      method: "POST",
      body: JSON.stringify({ name, email, password: hashedPassword }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    res.redirect("/mantenedor");
  } catch (error) {
    console.log(error);
    res.render("error", { error: "Problems creating user" });
  }
});



// LOGIN Y AUTENTIFICACIÓN !

router.post("/users/login",
  passport.authenticate("local", {
    failureRedirect: "/users/login",
    failureFlash: true
  }),
  function(req, res) {
    if (req.user.categoria === 1) {
      return res.redirect("/admin/landing");
    } else if (req.user.categoria === 2) {
      return res.redirect("/admin/colab");
    }
    return res.redirect("/mapa");
  }
);

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.categoria === 1) {
      return res.redirect("/admin/landing");
    } else if (req.user.categoria === 2) {
      return res.redirect("/admin/colab");
    } else {
      return res.redirect("/mapa");
    }
  }
  next();
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/users/login");
}

function checkCategoria1(req, res, next) {
  if (req.isAuthenticated() && req.user.categoria === 1) {
    return next();
  } else if (req.isAuthenticated() && req.user.categoria === 2) {
    return res.redirect("/admin/colab");
  }
  res.redirect("/users/carto");
}

function checkCategoria2(req, res, next) {
  if (req.isAuthenticated() && (req.user.categoria === 1 || req.user.categoria === 2)) {
    return next();
  }
  res.redirect("/users/carto");
}

// Mantenedor Usuarios Página

router.get("/mantenedor", checkNotAuthenticated, checkCategoria1, async (req, res) => {
  const resultado = await fetch("http://localhost:4000/api/v1/users");
  const data = await resultado.json();
  res.render("mantenedor", { "users": data, user: req.user });
});

// Mantenedor Usuarios DELETE

router.delete("/mantenedor/:id", async (req, res) => {
  console.log("método eliminar")
  const { id } = req.params
  const resultado = await fetch("http://localhost:4000/api/v1/users/" + id,
    { method: 'DELETE' });
  if (resultado.status == 200) {
    const datos = await fetch("http://localhost:4000/api/v1/users");
    const data = await datos.json();
    res.render("mantenedor", { "users": data, user: req.user });
  } else {
    res.render("error", { "error": "Problemas al Eliminar registro" });
  }

});

// Mantenedor POST

router.post("/mantenedor", async (req, res) => {
  try {
      const { name, email, password, categoria } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      // console.log(hashedPassword)
      const resultado = await fetch("http://localhost:4000/api/v1/users", {
          method: "POST",
          body: JSON.stringify({ name, email, password: hashedPassword, categoria }),
          headers: {
              "Content-Type": "application/json"
          }
      })
      const datos = await fetch("http://localhost:4000/api/v1/users");
      const data = await datos.json();
      res.render("mantenedor", { "users": data, user: req.user });
  } catch (e) {
      res.render("error", { "error": "Problemas al Insertar registro" });
  }
});

// EDITAR

router.put("/mantenedor/:id", async (req, res) => {
  try {
      const { id } = req.params;
      const { name, email, password, categoria } = req.body;
      const resultado = await fetch(`http://localhost:4000/api/v1/users/${id}`, {
          method: "PUT",
          body: JSON.stringify({ id, name, email, password, categoria }),
          headers: {
              "Content-Type": "application/json"
          }
      })
      const datos = await fetch(`http://localhost:4000/api/v1/users/`);
      const data = await datos.json();
      res.render("mantenedor", { "users": data, user: req.user });
  } catch (e) {
      res.render("error", { "error": "Problemas al Modificar registro" });
  }

});

// MANTENEDOR PUNTOS PÁGINA

router.get("/admin/control", checkNotAuthenticated, checkCategoria2, async (req, res) => {
  const resultado = await fetch("http://localhost:4000/api/v1/puntos2");
  const data = await resultado.json();
  console.log(data)
  res.render("mantenedor2", { "museums": data, user: req.user });
});

// Ingresar datos Mantenedor 2

router.post("/mantenedor2", async (req, res) => {
  try {
      const { nombre, img, direccion, horario, geom, categoria, creador } = req.body;
      console.log(nombre, img, direccion, horario, geom, categoria, creador)
      const resultado = await fetch("http://localhost:4000/api/v1/puntos", {
          method: "POST",
          body: JSON.stringify({ nombre, img, direccion, horario, geom, categoria, creador }),
          headers: {
              "Content-Type": "application/json"
          }
      })
      const datos = await fetch("http://localhost:4000/api/v1/puntos2");
      const data = await datos.json();
      res.render("mantenedor2", { "museums": data, user: req.user });
  } catch (e) {
      res.render("error", { "error": "Problemas al Insertar registro" });
  }
});

// Mantenedor Puntos DELETE

router.delete("/mantenedor2/:id", async (req, res) => {
  console.log("método eliminar")
  const { id } = req.params
  const resultado = await fetch("http://localhost:4000/api/v1/puntos/" + id,
    { method: 'DELETE' });
  if (resultado.status == 200) {
    const datos = await fetch("http://localhost:4000/api/v1/puntos2");
    const data = await datos.json();
    res.render("mantenedor2", { "museums": data, user: req.user });
  } else {
    res.render("error", { "error": "Problemas al Eliminar registro" });
  }

});

// EDITAR Mantenedor PUNTOS

router.put("/mantenedor2/:id", async (req, res) => {
  try {
      const { id } = req.params;
      const { nombre, img, direccion, horario, geom, categoria, creador } = req.body;
      const resultado = await fetch(`http://localhost:4000/api/v1/puntos/${id}`, {
          method: "PUT",
          body: JSON.stringify({ nombre, img, direccion, horario, geom, categoria, creador }),
          headers: {
              "Content-Type": "application/json"
          }
      })
      const datos = await fetch(`http://localhost:4000/api/v1/puntos2/`);
      const data = await datos.json();
      res.render("mantenedor2", { "museums": data, user: req.user });
  } catch (e) {
      res.render("error", { "error": "Problemas al Modificar registro" });
  }


});

// LOGOUT

router.get("*", (req, res) => {
  res.render("error")
})

export default router

