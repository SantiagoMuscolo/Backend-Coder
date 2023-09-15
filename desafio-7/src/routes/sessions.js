const { Router } = require('express');
const userController = require('../dao/users/userController/userController');
const bodyParser = require("body-parser");
const passport = require('passport');

module.exports = app => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    let router = new Router();

    app.use('/api/sessions', router);

    router.get('/login', userController.login);
    router.post('/register', passport.authenticate("register"), userController.register);
    router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => {});
}

