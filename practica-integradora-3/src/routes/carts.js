const { Router } = require('express');
const cartsController = require('../controllers/cartController/cartController')
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

module.exports = app => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());

    let router = new Router();

    app.use('/api/carts', router);
    
    router.get('/', cartsController.getAllCarts);
    router.post('/', cartsController.createCart);
    router.get('/', cartsController.getCart);
    router.get('/:cid', cartsController.products);
    router.post('/products', cartsController.addProduct);
    router.delete('/:cid/products/:pid', cartsController.deleteProductFromCart);
    router.delete('/:cid', cartsController.deleteProductsFromCart);
    router.put('/:cid/products/:pid', cartsController.updateProductsQuantity);
    router.put('/:cid', cartsController.updateProductsInCart);
    router.put('/:cid/purchase', cartsController.purchase);
}

