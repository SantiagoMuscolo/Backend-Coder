const Passport = require('passport');
const Local = require('passport-local');
const GitHubStrategy = require('passport-github2');
const userModel = require('../dao/models/user.model');
const jwt = require('jsonwebtoken');
const { createHash, isValidPassword } = require('../helper/bcrypt.helper');
const cartManager = require('../dao/cart/cartRepository/cartRepository');
const CustomError = require('../services/errors/CustomError');
const EErrors = require('../services/errors/enums');
const { generateUserErrorInfo } = require('../services/errors/info');

require('dotenv').config()

const LocalStrategy = Local.Strategy;
const initializePassport = () => {
  Passport.use("register", new LocalStrategy(
    { passReqToCallback: true, usernameField: "email" },
    async (req, username, password, done) => {
      const { first_name, last_name, email, age } = req.body;
      try {
        if(!first_name || !last_name || !email || !age){
          CustomError.createError({
            name: "user register error",
            cause: generateUserErrorInfo(req.body),
            message: `All fields must be completed`,
            code: EErrors.INVALID_TYPES_ERROR
          });
        }
        let user = await userModel.findOne({ email: username });
        if (user) return done(null, false);
        const hashedPassword = await createHash(password);
        const cartId = await cartManager.createCart();
        const role = 'admin';
        const newUser = {
          first_name,
          last_name,
          email,
          age,
          password: hashedPassword,
          role,
          cart: cartId,
          isPremium: true
        };
        let result = await userModel.create(newUser);
        if (result) {
          const token = jwt.sign({ email: user.email, cart: cartId }, 'secret123');
          return done(null, { newUser, token });
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
      if (!user) return done(null, false);
      if (!isValidPassword(user, password)) return done(null, false);
      const token = jwt.sign({ email: user.email, cart: user.cart._id }, 'secret123');
      return done(null, { user, token });
    } catch (error) {
      return done(error);
    }
  }));

  Passport.use("github", new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
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