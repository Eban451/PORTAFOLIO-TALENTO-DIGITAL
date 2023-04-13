import { Router } from "express";
import { pool } from "../dbConfig.js";
import express from "express";
import fs from "fs";
import bodyParser from "body-parser";
import passport from "passport";
import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "express-flash";
import pg from 'pg';
import bcrypt from 'bcrypt';
import pgPromise from 'pg-promise';
import passportLocal from 'passport-local';
import { Strategy as LocalStrategy } from 'passport-local';

const router = Router()


router.use(express.urlencoded({ extended: false })); // MIDDLEWARE para enviar los datos del frontend al backend



// const { Pool } = pg;


// const pool = new Pool({
//     user: "postgres",
//     host: "localhost",
//     database: "puntos", //nombre de database
//     password: "12345",
//     port: 5432

// })

import {leerArchivo} from "../public/js/functions.js" //Función para leer archivos almacenados en local

//Constantes
const pgp = pgPromise();
const db = pgp('postgres://postgres:12345@localhost:5432/puntos');

//Middleware usado para crear una estrategia de autenticación
// const rutaUsuarios = "BD/usuarios.json" // Ruta a json con los usuarios "registrados"
// const usuarios = await leerArchivo(rutaUsuarios) //Lectura y asignación json a variable usuarios
//Variable
let autenticacion = false;


router.use(bodyParser.urlencoded({extended: true}))

router.use(cookieParser("secretKey"))

router.use(session({
    secret:"secretKey",
    saveUninitialized: false, 
    resave:false

}))

router.use(flash());

router.use(passport.initialize())
router.use(passport.session())



router.get("/", (req, res) =>{
    res.render("index",{"titulo": "Página Personal"})
})

router.get("/users/login", (req, res) =>{
    res.render("login")
})

router.get("/users/registro", (req, res) =>{
  res.render("registro")
})

router.get("/users/carto", (req, res) =>{
res.render("carto")
})


// Registro

router.post("/users/registro", async (req, res) => {
  let { name, email, password, password2 } = req.body;

  let errors = [];

  console.log({
    name,
    email,
    password,
    password2
  });

  if (!name || !email || !password || !password2) {
    errors.push({ message: "Please enter all fields" });
  }

  if (password.length < 6) {
    errors.push({ message: "Password must be at least 6 characters long" });
  }

  if (password !== password2) {
    errors.push({ message: "Passwords do not match" });
  }

  if (errors.length > 0) {
    res.render("registro", { errors, name, email, password, password2 });
  } else {
    try {
      const hashedPassword = await bcrypt.hash(password, 10); // Declare and initialize hashedPassword
      console.log(hashedPassword);
      // Validation passed
      pool.query(
        `SELECT * FROM users
          WHERE email = $1`,
        [email],
        (err, results) => {
          if (err) {
            console.log(err);
          }
          console.log(results.rows);

          if (results.rows.length > 0) {
            return res.render("registro", {
              message: "Email already registered"
            });
          } else {
            pool.query(
              `INSERT INTO users (name, email, password)
                  VALUES ($1, $2, $3)
                  RETURNING id, password`,
              [name, email, hashedPassword],
              (err, results) => {
                if (err) {
                  throw err;
                }
                console.log(results.rows);
                req.flash("success_msg", "You are now registered. Please log in");
                res.redirect("/users/login");
              }
            );
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
});


// // LOGIN FUNCIONALIDAD

// router.post('/login', (req, res) => {
//     const email = req.body.email;
//     const password = req.body.password;

//     // Retrieve user from the database by email
//     pool.query('SELECT * FROM usuarios WHERE email = $1', [email], (err, result) => {
//         if (err) {
//             console.error(err);
//             res.status(500).send('Error logging in');
//         } else if (result.rows.length === 0) {
//             res.render('login', { error: 'Invalid email or password' });
//         } else {
//             const hashedPassword = result.rows[0].password;

//             // Compare the provided password with the hashed password
//             bcrypt.compare(password, hashedPassword, (err, isMatch) => {
//                 if (err) {
//                     console.error(err);
//                     res.status(500).send('Error logging in');
//                 } else if (isMatch) {
//                     res.send(`Welcome ${email}!`);
//                 } else {
//                     res.render('login', { error: 'Invalid email or password' });
//                 }
//             });
//         }
//     });
// });




// // Route for handling the form submission
// router.post('/registro', (req, res) => {
//     // Get the data from the form submission
//     const correo = req.body.correo;
//     const nombre = req.body.nombre;
//     const apellido = req.body.apellido;
//     const password = req.body.password;
  
//     // Read the existing users from the usuarios.json file
//     const usuarios = JSON.parse(fs.readFileSync('BD/usuarios.json'));
  
//     // Generate a unique ID for the new user
//     const newId = usuarios.length + 1;
  
//     // Create the new user object with the generated ID
//     const newUser = {
//       id: newId,
//       correo: correo,
//       nombre: nombre,
//       apellido: apellido,
//       password: password
//     };
  
//     // Add the new user to the existing array of users
//     usuarios.push(newUser);
  
//     // Write the updated array of users back to the usuarios.json file
//   fs.writeFile('BD/usuarios.json', JSON.stringify(usuarios, null, 2), (err) => {
//     if (err) {
//       console.log(err);
//       res.send('Error al registrar el usuario.');
//     } else {
//       // Redirect the user to a confirmation page
//       res.render('login', { correo: correo });
//     }
//   });
// });

router.get("*", (req, res) =>{
    res.render("error")
})

export default router

