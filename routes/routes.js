import { Router } from "express";
import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "express-flash";
import bcrypt from 'bcrypt';
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

// Función dentro de passport que inicializa el pass
router.use(passport.initialize());
// Almacenar nuestras variables para que persistan durante toda la sesión. Funciona con router.use(Session) de más arriba arriba
router.use(passport.session());

router.use(flash());

router.use(passport.initialize())
router.use(passport.session())

router.use(methodOverride("_method", { methods: ["GET", "POST"] }));


// SUBIR AVATAR USERS
// sube el archivo y con el fs. compara si existe y lo sobreescribe si existiería un
// archivo con el mismo nombre para no llenvar el servidor cada vez que un usario
// sube una nueva foto de avatar

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
  // req.file contiene información sobre el archivo cargado
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a file' });
  }

  const avatarFilename = req.file.filename;
  const avatarUrl = '/img/' + avatarFilename;

  
  return res.redirect('/profile');
});


// RUTAS

router.get("/", (req, res) => {
  res.render("index", { "titulo": "Inicio" })
})

// router.get("/users/login", checkAuthenticated, async (req, res) => {
//   const resultado = await fetch("http://localhost:4000/api/v1/users");
//   const data = await resultado.json();
//   res.render("login", { "users": data });
// });

router.get("/users/registro", checkAuthenticated, (req, res) => {
  res.render("registro")
})

router.get("/mapa", checkNotAuthenticated, (req, res) => {
  res.render("mapa")
})

router.get("/contacto", (req, res) => {
  res.render("contacto")
})

router.get("/loginregistro",checkAuthenticated, (req, res) => {
  res.render("loginregistro")
})

router.get("/users/carto", checkNotAuthenticated, (req, res) => {
  // console.log(req.isAuthenticated());
  res.render("carto", { user: req.user })
})

router.get("/admin/landing", checkNotAuthenticated, checkCategoria1, async (req, res) => {
  const resultadoTipo = await fetch("http://localhost:4000/api/v1/estats1");
  const countsByTipo = await resultadoTipo.json();

  const resultadoCreador = await fetch("http://localhost:4000/api/v1/estats2");
  const countsByCreador = await resultadoCreador.json();
  res.render("landingadmin", { user: req.user, countsByTipo, countsByCreador })
})

router.get("/admin/colab", checkNotAuthenticated, checkCategoria2, async (req, res) => {
  const resultadoTipo = await fetch("http://localhost:4000/api/v1/estats1");
  const countsByTipo = await resultadoTipo.json();

  const resultadoCreador = await fetch("http://localhost:4000/api/v1/estats2");
  const countsByCreador = await resultadoCreador.json();
  res.render("landingcolab", { user: req.user, countsByTipo, countsByCreador })
})


router.get("/profile", checkNotAuthenticated, (req, res) => {
  res.render("profile", { user: req.user })
})


// Registro Usuarios

router.post("/registro", async (req, res) => {
  const { name, email, password } = req.body;

  // Acá se guardan los mensajes de errores
  let errors2 = [];

  //comprueba que se hayan enviado todos los datos necesarios para el registro
  if (!name || !email || !password) {
    errors2.push("Please enter all fields");
  }

  // Valida si la contraseña tiene más de 6 caracteres 
  if (password.length < 6) {
    errors2.push("La contraseña debe tener al menos de 6 caracteres");
  }

  // Valida el formato de correo electrónico usando una expresión regular
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    errors2.push("Por favor ingrese un email válido");
  }

  try {
    // Checkea si el email ya existe en la base de datos
    const datos = await fetch("http://localhost:4000/api/v1/users3");
    const data = await datos.json();
    const userExists = data.some((user) => user.email === email);
    if (userExists) {
      errors2.push("El email ingresado ya existe en nuestros registros");
    }
 
    // Si hay 1 error o más envía el o los mensajes de error al front
    if (errors2.length > 0) {
      return res.render("loginregistro", { errors2, name, email, password });
    }
  
    // Envía los datos a la base de datos si no existe ningún error
    const hashedPassword = await bcrypt.hash(password, 10);
    const userResponse = await fetch("http://localhost:4000/api/v1/users3", {
      method: "POST",
      body: JSON.stringify({ name, email, password: hashedPassword }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Mensaje si se registra correctamente
    req.flash("success_msg", "Te has registrado correctamente");

    res.redirect("/loginregistro");
  } catch (error2) {
    console.log(error2);
    res.render("error", { error: "Problems creating user" });
  }
});



// LOGIN Y AUTENTIFICACIÓN !

// Comprueba si existe el usario y contraseña según las funciones en PassportCongif.js
// y redirige según la categoría de usuario

router.post("/users/login",
  passport.authenticate("local", {
    failureRedirect: "/loginregistro",
    failureFlash: true
  }),
  function (req, res) {
    if (req.user.categoria === 1) {
      return res.redirect("/admin/landing");
    } else if (req.user.categoria === 2) {
      return res.redirect("/admin/colab");
    }
    return res.redirect("/mapa");
  }
);

// Redirige según la categoría de usuario
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

// Sino está autenticado se redirige al login
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/loginregistro");
}

// Redirige según la categoría de usuario
function checkCategoria1(req, res, next) {
  if (req.isAuthenticated() && req.user.categoria === 1) {
    return next();
  } else if (req.isAuthenticated() && req.user.categoria === 2) {
    return res.redirect("/admin/colab");
  }
  res.redirect("/mapa");
}

// Redirige según la categoría de usuario
function checkCategoria2(req, res, next) {
  if (req.isAuthenticated() && (req.user.categoria === 1 || req.user.categoria === 2)) {
    return next();
  }
  res.redirect("/mapa");
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

  req.flash("success_msg3", "Usuario borrado correctamente");

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

    req.flash("success_msg", "Usuario ingresado correctamente");

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

    req.flash("success_msg2", "Usuario editado correctamente");

    const datos = await fetch(`http://localhost:4000/api/v1/users/`);
    const data = await datos.json();
    res.render("mantenedor", { "users": data, user: req.user });
  } catch (e) {
    res.render("error", { "error": "Problemas al Modificar registro" });
  }

});

// MANTENEDOR PUNTOS PÁGINA

router.get("/mantenedor2", checkNotAuthenticated, checkCategoria2, async (req, res) => {
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

    req.flash("success_msg", "Ubicación agregada correctamente");

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

  req.flash("success_msg2", "Ubicación borrada correctamente");

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

    req.flash("success_msg3", "Ubicación editada correctamente");

    const datos = await fetch(`http://localhost:4000/api/v1/puntos2`);
    const data = await datos.json();
    res.render("mantenedor2", { "museums": data, user: req.user });
  } catch (e) {
    res.render("error", { "error": "Problemas al Modificar registro" });
  }


});

// LOGOUT

router.get("/users/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      // Handle error, if any
      console.error(err);
    }
    res.render("loginregistro", { message: "Te has desconectado" });
    res.redirect("/");
  });
});

// Pagina ERROR

router.get("*", (req, res) => {
  res.render("error")
})

export default router

