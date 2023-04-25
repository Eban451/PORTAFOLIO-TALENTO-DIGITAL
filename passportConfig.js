import { Strategy as LocalStrategy } from "passport-local";
import { pool } from "./dbConfig.js";
import bcrypt from "bcrypt";

const initialize = (passport) => {
  console.log("Initialized");

  const fetchUser = async (email) => {
    const response = await fetch(`http://localhost:4000/api/v1/users2?email=${email}`);
    const data = await response.json();
    return data[0];
  }
  
  const authenticateUser = async (email, password, done) => {
    console.log(email, password);
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
            //password is incorrect
            return done(null, false, { message: "Password is incorrect" });
          }
        });
      } else {
        // No user
        return done(null, false, {
          message: "No user with that email address",
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
  // Stores user details inside session. serializeUser determines which data of the user
  // object should be stored in the session. The result of the serializeUser method is attached
  // to the session as req.session.passport.user = {}. Here for instance, it would be (as we provide
  //   the user id as the key) req.session.passport.user = {id: 'xyz'}
  passport.serializeUser((user, done) => done(null, user.id));

  // In deserializeUser that key is matched with the in memory array / database or any data resource.
  // The fetched object is attached to the request object as req.user

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
