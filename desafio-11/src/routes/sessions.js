const { Router } = require('express');
const userController = require('../controllers/userController/userController');
const bodyParser = require("body-parser");
const passport = require('passport');
const initializePassport = require('../config/passport.config');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
require('dotenv').config()

module.exports = app => {
  app.use(session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 24 * 60 * 60
    }),
    secret: process.env.MONGO_SECRET,
    resave: false,
    saveUninitialized: true
  }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  initializePassport();
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(cookieParser());

  let router = new Router();

  app.use('/api/sessions', router);
  app.use("/githubcallback", userController.githubCallbackAuthenticate, userController.githubCallBack)

  router.post("/register", userController.authenticateRegister, userController.register);
  router.post("/login", userController.authenticateLogin, userController.login);
  router.post('/forgot-password', userController.forgotPassword);
  router.use('/current', userController.current)
  router.get("/github", userController.githubAuthenticate);
  router.post('/logout', userController.logout);
}