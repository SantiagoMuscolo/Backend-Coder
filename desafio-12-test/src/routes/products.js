const { Router } = require('express');
const productsController = require('../controllers/productsController/productsController');
const bodyParser = require("body-parser");
const { validateRole } = require('../middlewares/validateRole.middleware');
const cookieParser = require('cookie-parser');

module.exports = app => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());

    let router = new Router();

    app.use('/api/products', router);

    router.get('/', validateRole('admin'), productsController.getProducts);
    router.get('/:pid', validateRole('admin'), productsController.getProductById);
    router.post('/', validateRole('admin'), productsController.addProduct);
    router.put('/:pid', validateRole('admin'), productsController.updateProduct);
    router.delete('/:pid', validateRole('admin'), productsController.deleteProduct);
}

