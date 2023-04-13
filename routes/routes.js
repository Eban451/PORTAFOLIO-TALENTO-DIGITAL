import { Router } from "express";
import fs from "fs";
import bodyParser from "body-parser";
import passport from "passport";
import cookieParser from "cookie-parser";
import session from "express-session";
import pg from 'pg';
import bcrypt from 'bcrypt';
import pgPromise from 'pg-promise';
import passportLocal from 'passport-local';


import { Strategy as LocalStrategy } from 'passport-local';




const { Pool } = pg;


const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "puntos", //nombre de database
    password: "12345",
    port: 5432

})

import {leerArchivo} from "../public/js/functions.js" //Función para leer archivos almacenados en local

//Constantes
const pgp = pgPromise();
const db = pgp('postgres://postgres:12345@localhost:5432/puntos');
const router = Router()
//Middleware usado para crear una estrategia de autenticación
// const rutaUsuarios = "BD/usuarios.json" // Ruta a json con los usuarios "registrados"
// const usuarios = await leerArchivo(rutaUsuarios) //Lectura y asignación json a variable usuarios
//Variable
let autenticacion = false;

class User {
    constructor(id, username, password) {
      this.id = id;
      this.username = username;
      this.password = password;
    }
  }


router.use(bodyParser.urlencoded({extended: true}))

router.use(cookieParser("secretKey"))

router.use(session({
    secret:"secretKey",
    saveUninitialized: true, 
    resave:true

}))

router.use(passport.initialize())
router.use(passport.session())

passport.use(
    new LocalStrategy(
      {
        usernameField: 'username', // Specify the field name for the username in the request
        passwordField: 'password', // Specify the field name for the password in the request
      },
      async (username, password, done) => {
        try {
          // Find user by username in the database
          const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1', username);
  
          if (!user) {
            // If user not found, return error
            return done(null, false, { message: 'Incorrect username.' });
          }
  
          if (user.password !== password) {
            // If password doesn't match, return error
            return done(null, false, { message: 'Incorrect password.' });
          }
  
          // If username and password match, return user object
          return done(null, user);
        } catch (err) {
          // If any error occurs, return error
          return done(err);
        }
      }
    )
  );


router.get("/", (req, res) =>{
    res.render("index",{"titulo": "Página Personal"})
})

import { ensureAuthenticated } from '../middlewares/auth'; // Import a custom middleware to ensure authentication

// Modify the route to use passport-local
router.get('/carto', ensureAuthenticated, (req, res) => {
  // Render the "carto" view if the user is authenticated
  res.render('carto', { autenticacion: true });
});


// router.get("/carto", (req,res,next) =>{  
                                
//     if(req.isAuthenticated()){ //Si ya está autenticado seguira al siguiente parámetro que ingresemos a router.get()
//         autenticacion = true
//         return next()
//     }else{
//         res.redirect("/login") //Si aún no está autenticado, redirigirá a "login"
//     }
// },
// (req, res) =>{ //Con las comprobaciones anteriores exitosas pasa a renderizar la vista "carto"
//     res.render("carto",{autenticacion})
// }
// )

router.get("/login", (req, res) =>{
    res.render("login")
})

// LOGIN FUNCIONALIDAD

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // Retrieve user from the database by email
    pool.query('SELECT * FROM usuarios WHERE email = $1', [email], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error logging in');
        } else if (result.rows.length === 0) {
            res.render('login', { error: 'Invalid email or password' });
        } else {
            const hashedPassword = result.rows[0].password;

            // Compare the provided password with the hashed password
            bcrypt.compare(password, hashedPassword, (err, isMatch) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error logging in');
                } else if (isMatch) {
                    res.send(`Welcome ${email}!`);
                } else {
                    res.render('login', { error: 'Invalid email or password' });
                }
            });
        }
    });
});

router.get("/registro", (req, res) =>{
    res.render("registro")
})


// Route for handling the form submission
router.post('/registro', (req, res) => {
    // Get the data from the form submission
    const correo = req.body.correo;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const password = req.body.password;
  
    // Read the existing users from the usuarios.json file
    const usuarios = JSON.parse(fs.readFileSync('BD/usuarios.json'));
  
    // Generate a unique ID for the new user
    const newId = usuarios.length + 1;
  
    // Create the new user object with the generated ID
    const newUser = {
      id: newId,
      correo: correo,
      nombre: nombre,
      apellido: apellido,
      password: password
    };
  
    // Add the new user to the existing array of users
    usuarios.push(newUser);
  
    // Write the updated array of users back to the usuarios.json file
  fs.writeFile('BD/usuarios.json', JSON.stringify(usuarios, null, 2), (err) => {
    if (err) {
      console.log(err);
      res.send('Error al registrar el usuario.');
    } else {
      // Redirect the user to a confirmation page
      res.render('login', { correo: correo });
    }
  });
});

router.get("*", (req, res) =>{
    res.render("error")
})

export default router

