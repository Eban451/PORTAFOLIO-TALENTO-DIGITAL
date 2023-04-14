import { Router } from "express";
import { pool } from "../dbConfig.js";
import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "express-flash";
import bcrypt from 'bcrypt';


const router = Router()

import initializePassport from "../passportConfig.js";


initializePassport(passport);

router.use(express.urlencoded({ extended: false })); // MIDDLEWARE para enviar los datos del frontend al backend



router.use(bodyParser.urlencoded({extended: true}))

router.use(cookieParser("secretKey"))

router.use(session({
    secret:"secretKey",
    saveUninitialized: false, 
    resave:false

}))

// Funtion inside passport which initializes passport
router.use(passport.initialize());
// Store our variables to be persisted across the whole session. Works with app.use(Session) above
router.use(passport.session());

router.use(flash());

router.use(passport.initialize())
router.use(passport.session())



router.get("/", (req, res) =>{
    res.render("index",{"titulo": "Página Personal"})
})

router.get("/users/login",checkAuthenticated, (req, res) =>{
    res.render("login")
})

router.get("/users/registro",checkAuthenticated, (req, res) =>{
  res.render("registro")
})

router.get("/users/carto",checkNotAuthenticated, (req, res) =>{
  console.log(req.isAuthenticated());
res.render("carto", { user: req.user.name })
})

router.get("/users/logout", (req, res) => {
  req.logout(function(err) {
    if (err) {
      // Handle error, if any
      console.error(err);
    }
    res.render("login", { message: "Te has desconectado" });
    res.redirect("/users/login");
  });
});


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

router.get("*", (req, res) =>{
    res.render("error")
})

export default router

