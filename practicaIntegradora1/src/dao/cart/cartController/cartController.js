const CartService = require('../cartService/cartService');

class CartController {

    async getAllCarts(req, res) {
        try {
            const carts = await CartService.getAllCarts();

            res.json(carts)
        } catch (error) {
            res.status(500).send('Error al obtener los carritos.');
        }
    }


    async createCart(req, res) {
        try {
            const { products } = req.body;

            const newCart = await CartService.createCart(products);

            res.json(newCart);
        } catch (error) {
            res.status(500).json({ error: 'Error al crear carrito' });
        }
    }

    async products(req, res) {
        try {
            const cartId = parseInt(req.params.cid);

            const products = await CartService.getProducts(cartId);

            res.json(products);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    async addProduct(req, res) {
        try {
            const cartId = parseInt(req.params.cid);
            const productId = parseInt(req.params.pid);

            const cart = await CartService.addProduct(cartId, productId);

            if(cart){
                res.status(200).json({message: 'Producto subido exitosamente!'});
            }else{
                res.status(500).json({ error: 'Error al subir el producto' });
            }
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }
    
}

module.exports = new CartController();
