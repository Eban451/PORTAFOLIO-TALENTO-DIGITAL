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

router.get("/", (req, res) => {
  res.render("index", { "titulo": "Página Personal" })
})

router.get("/users/login", async (req, res) => {
  const resultado = await fetch("http://localhost:4000/api/v1/users");
  const data = await resultado.json();
  res.render("login", { "users": data });
});

router.get("/users/registro", checkAuthenticated, (req, res) => {
  res.render("registro")
})

router.get("/admin/control", async (req, res) => {
  const resultado = await fetch("http://localhost:4000/api/v1/puntos2");
  const data = await resultado.json();
  console.log(data)
  res.render("admin", { "museums": data });
});

// router.get("/admin/control", checkAuthenticated, (req, res) => {
//   res.render("admin")
// })

router.get("/mapa", checkAuthenticated, (req, res) => {
  res.render("mapa")
})


router.get("/users/carto", checkNotAuthenticated, (req, res) => {
  console.log(req.isAuthenticated());
  res.render("carto", { user: req.user.name })
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


// Registro Usuarios

router.post("/registro", async (req, res) => {
  const { name, email, password } = req.body;

  let errors = [];

  if (!name || !email || !password) {
    errors.push("Please enter all fields");
  }

  if (password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  // Validate email format using regular expression
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    errors.push("Please enter a valid email address");
  }

  try {
    // Check if email already exists in database
    const datos = await fetch("http://localhost:4000/api/v1/users3");
    const data = await datos.json();
    const userExists = data.some((user) => user.email === email);
    if (userExists) {
      errors.push("This email is already registered");
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



// LOGIN

router.post(
  "/users/login",
  passport.authenticate("local", {
    successRedirect: "/users/carto",
    failureRedirect: "/users/login",
    failureFlash: true
  })
);

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/carto");
  }
  next();
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/users/login");
}

//// ADMIN

// router.get('/mapa', (req, res) => {
//   const query = 'SELECT id, nombre, img, direccion, horario, ST_AsGeoJSON(geom) FROM museums';

//   pool.query(query)
//     .then((result) => {
//       const rows = result.rows.map((row) => {
//         const { coordinates } = JSON.parse(row.st_asgeojson);
//         return {
//           id: row.id,
//           nombre: row.nombre,
//           img: row.img,
//           direccion: row.direccion,
//           horario: row.horario,
//           coordinates,
//         };
//       });
//       res.render('mapa');
//       console.log(rows.map((row) => row));
//     })
//     .catch((err) => {
//       console.error('Error fetching data from PostgreSQL database', err);
//     });
//   console.log("SI?")
// });

// Mantenedor Página

router.get("/mantenedor", async (req, res) => {
  //const resultado = await pool.query("select  * from personas");
  //console.log(resultado.rows);
  const resultado = await fetch("http://localhost:4000/api/v1/users");
  const data = await resultado.json();
  res.render("mantenedor", { "users": data });
});

// Mantenedor DELETE

router.delete("/mantenedor/:id", async (req, res) => {
  console.log("método eliminar")
  const { id } = req.params
  const resultado = await fetch("http://localhost:4000/api/v1/users/" + id,
    { method: 'DELETE' });
  if (resultado.status == 200) {
    const datos = await fetch("http://localhost:4000/api/v1/users");
    const data = await datos.json();
    res.render("mantenedor", { "users": data });
  } else {
    res.render("error", { "error": "Problemas al Eliminar registro" });
  }

});

// Mantenedor PUT

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
      res.render("mantenedor", { "users": data });
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
      res.render("mantenedor", { "users": data });
  } catch (e) {
      res.render("error", { "error": "Problemas al Modificar registro" });
  }


});

router.get("*", (req, res) => {
  res.render("error")
})

export default router

