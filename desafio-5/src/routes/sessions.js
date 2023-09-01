const { Router } = require('express');
const userController = require('../dao/users/userController/userController');
const userManager = require('../dao/users/userService/userService');
const bodyParser = require("body-parser");

module.exports = app => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    let router = new Router();

    app.use('/api/sessions', router);
    
    router.get('/login', userController.login);
    router.post('/register', userController.register);
}

