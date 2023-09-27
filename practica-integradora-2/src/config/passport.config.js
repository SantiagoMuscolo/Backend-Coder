const Passport = require('passport');
const Local = require('passport-local');
const GitHubStrategy = require('passport-github2');
const userModel = require('../dao/models/user.model');
const jwt = require('jsonwebtoken');
const { createHash, isValidPassword } = require('../helper/bcrypt.helper')

const LocalStrategy = Local.Strategy;
const initializePassport = () => {
  Passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;

        try {
          let user = await userModel.findOne({ email: username });
          if (user) {
            console.log("El usuario " + email + " ya se encuentra registrado!");
            return done(null, false);
          }

          const hashedPassword = await createHash(password);

          user = {
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
          };

          let result = await userModel.create(user);

          if (result) {
            const token = jwt.sign({ email: user.email }, 'secret123');
            return done(null, { user, token });
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  Passport.use("login", new LocalStrategy({ usernameField: "email" }, async (username, password, done) => {
    try {
      let user = await userModel.findOne({ email: username });
      console.log(user);

      if (!user) {
        console.log("Error! El usuario no existe!");
        return done(null, false);
      }

      if (!(await isValidPassword(user, password))) {
        console.log("Error! La contraseña es inválida!");
        return done(null, false);
      }

      const token = jwt.sign({ email: user.email }, 'secret123');
      return done(null, { user, token });
    } catch (error) {
      return done(error);
    }
  }));

  Passport.use("github", new GitHubStrategy({
    clientID: "Iv1.150877ba9d848d6a",
    clientSecret: "34cd8e43f3dcd56707a368a3d49be8a23209b84f",
    callbackURL: "http://localhost:8080/githubcallback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await userModel.findOne({ email: profile._json.email });

      if (user) {
        return done(null, user);
      } else {
        let newUser = {
          first_name: profile._json.name,
          last_name: "",
          email: profile._json.email,
          age: 100,
          password: ""
        }

        let result = await userModel.create(newUser);

        return done(null, result);
      }
    } catch (error) {
      return done(error);
    }
  }));

  Passport.serializeUser((userWithToken, done) => {
    done(null, userWithToken);
  });

  Passport.deserializeUser((userWithToken, done) => {
    done(null, userWithToken);
  });
}

module.exports = initializePassport;