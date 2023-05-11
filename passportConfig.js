import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";

const initialize = (passport) => {
  console.log("Initialized");

  const fetchUser = async (email) => {
    const response = await fetch(`http://localhost:4000/api/v1/users2?email=${email}`);
    const data = await response.json();
    return data[0];
  }
  
  const authenticateUser = async (email, password, done) => {
    // console.log(email, password);
    try {
      const user = await fetchUser(email);
  
      if (user) {
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            console.log(err);
          }
          if (isMatch) {
            return done(null, user);
          } else {
            
            return done(null, false, { message: "La contraseña es incorrecta" });
          }
        });
      } else {
        
        return done(null, false, {
          message: "No existe un usuario con ese correo",
        });
      }
    } catch (err) {
      console.error(err);
      done(err);
    }
  };

  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      authenticateUser
    )
  );
  // Almacena los detalles del usuario dentro de la sesión. serializeUser determina qué datos del objeto de usuario deben
  // almacenarse en la sesión. El resultado del método serializeUser se adjunta a la sesión como req.session.passport.user = {}.
  // Aquí, por ejemplo, sería (ya que proporcionamos la identificación del usuario como clave) req.session.passport.user = {id: 'xyz'}
  passport.serializeUser((user, done) => done(null, user.id));

  // En deserializeUser, esa clave se compara con la matriz/base de datos en memoria o cualquier recurso de datos.
  // El objeto obtenido se adjunta al objeto de solicitud como req.user

  passport.deserializeUser(async (id, done) => {
    try {
      const response = await fetch(`http://localhost:4000/api/v1/users/${id}`);
      const user = await response.json();
      console.log(`ID is ${user.id}`);
      done(null, user);
    } catch (err) {
      console.error(err);
      done(err);
    }
  });
};

export default initialize;
