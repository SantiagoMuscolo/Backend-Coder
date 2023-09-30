const { Router } = require('express');
const userController = require('../controllers/userController/userController');
const bodyParser = require("body-parser");
const passport = require('passport');
const initializePassport = require('../config/passport.config');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');


module.exports = app => {
  app.use(session({
    store: MongoStore.create({
      mongoUrl: "mongodb+srv://santiagoMuscolo:Sanlorenzo2003@codecluster.cjqx2s9.mongodb.net/ecommerce?retryWrites=true&w=majority",
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 20
    }),
    secret: 'S3cr3t0',
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

  router.post("/register", passport.authenticate("register", { failureRedirect: "/failregister" }), async (req, res) => {
    console.log(req.user);
    if (!req.user) return res.status(401).send({ message: 'Invalid User' });
  
    const token = req.user.token; 
    res.cookie('coderToken', token, { maxAge: 3600000, httpOnly: true }); 
    res.send({ status: "OK", message: 'usuario registrado' });
  });
  
  router.post("/login", passport.authenticate("login", { failureRedirect: "/faillogin" }), async (req, res) => {
    if (!req.user) return res.status(401).send({ message: 'Invalid User' });
  
    const token = req.user.token;
    res.cookie('coderToken', token, { maxAge: 3600000, httpOnly: true });
    res.send({ status: 200, message: 'usuario registrado' });
  });


  router.use('/current', (req, res) => {
    console.log(req.body);
    if (req.isAuthenticated()) {
      const user = req.user;
      res.json({ user });
    } else {
      res.status(401).json({ message: 'Usuario no autenticado' });
    }
  })

  router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { });

  app.use("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), userController.githubCallBack)

  app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error al cerrar sesión:', err);
      }

      res.redirect('/');
    });
  });
}