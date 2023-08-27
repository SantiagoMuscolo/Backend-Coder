const { Router } = require('express');
const cartsController = require('../dao/cart/cartController/cartController')
const bodyParser = require("body-parser");


module.exports = app => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    let router = new Router();

    app.use('/api/carts', router);
    
    router.get('/', cartsController.getAllCarts);
    router.post('/', cartsController.createCart);
    router.get('/:cid', cartsController.products);
    router.post('/:cid/products/:pid', cartsController.addProduct);
    router.delete('/:cid/products/:pid', cartsController.deleteProductFromCart);
    router.delete('/:cid', cartsController.deleteProductsFromCart)
    router.put('/:cid/products/:pid', cartsController.updateProductsQuantity)
    router.put('/:cid', cartsController.updateProductsInCart);
}

