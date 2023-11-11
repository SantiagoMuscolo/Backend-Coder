const { Router } = require('express');
const mockController = require('../controllers/mockController/mockController')
const bodyParser = require("body-parser");


module.exports = app => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    let router = new Router();

    app.use('/api/mock', router);
    
    router.get('/mockingproducts', mockController.getMockProducts);
}

