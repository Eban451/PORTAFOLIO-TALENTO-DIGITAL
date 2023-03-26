import { Router } from "express";
import fs from "fs";
import bodyParser from "body-parser";
import passport from "passport";
import PassportLocal from "passport-local"
import cookieParser from "cookie-parser";
import session from "express-session";

import {leerArchivo} from "../public/js/functions.js" //Función para leer archivos almacenados en local

//Constantes
const router = Router()
const PassPortLocal = PassportLocal.Strategy //Middleware usado para crear una estrategia de autenticación
const rutaUsuarios = "BD/usuarios.json" // Ruta a json con los usuarios "registrados"
const usuarios = await leerArchivo(rutaUsuarios) //Lectura y asignación json a variable usuarios
//Variable
let autenticacion = false;


router.use(bodyParser.urlencoded({extended: true}))

router.use(cookieParser("secretKey"))

router.use(session({
    secret:"secretKey",
    saveUninitialized: true, 
    resave:true

}))

router.use(passport.initialize())
router.use(passport.session())

passport.use(new PassPortLocal(function(username,password,done){
    for (let index = 0; index < usuarios.length; index++) {
        let element = usuarios[index];
        if(username == element.correo && password == element.password){
            return done(null,{id:element.id, name:element.nombre})
        }
    }
    return done(null,false)
}))

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    done(null,{id})
});


router.get("/", (req, res) =>{
    res.render("index",{"titulo": "Página Personal"})
})

router.get("/carto", (req,res,next) =>{  
                                
    if(req.isAuthenticated()){ //Si ya está autenticado seguira al siguiente parámetro que ingresemos a router.get()
        autenticacion = true
        return next()
    }else{
        res.redirect("/login") //Si aún no está autenticado, redirigirá a "login"
    }
},
(req, res) =>{ //Con las comprobaciones anteriores exitosas pasa a renderizar la vista "carto"
    res.render("carto",{autenticacion})
}
)

router.get("/login", (req, res) =>{
    res.render("login")
})

router.post("/login",passport.authenticate("local",{successRedirect: "/carto",failureRedirect: "/login"}))

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
  fs.writeFile('BD/usuarios.json', JSON.stringify(usuarios), (err) => {
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

