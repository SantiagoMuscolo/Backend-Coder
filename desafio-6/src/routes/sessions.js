const { Router } = require('express');
const userController = require('../dao/users/userController/userController');
const bodyParser = require("body-parser");
const passport = require('passport');
const initializePassport = require('../config/passport.config');
const session = require('express-session');
const MongoStore = require('connect-mongo');

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
    let router = new Router();

    app.use('/api/sessions', router);

    router.post("/login", passport.authenticate("login", {failureRedirect:"/faillogin"}), async (req, res) => {
        res.redirect("/products");
    });
    router.post("/register", passport.authenticate("register", {failureRedirect:"/failregister"}), async (req, res) => {
        res.redirect("/");
    });
    router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { });
    router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), userController.githubCallBack)
}