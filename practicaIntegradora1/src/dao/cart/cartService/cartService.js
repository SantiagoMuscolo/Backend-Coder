const cartModel = require('../../models/cart.model');

class CartService {
    static id = 0;

    constructor() {
        this.carritos = [];
    }

    getAllCarts() {
        try {
            return cartModel.find().lean();
        } catch (error) {
            console.log(error);
        }
    }

    async createCart() {
        try {
            const id = ++CartService.id;
            const newCart = {
                id,
                products: []
            };

            await cartModel.create(newCart)
        } catch (error) {
            console.log(`[ERROR] -> ${error}`);
        }
    }

    async getProducts(cartId) {
        try {
            const cart = cartModel.findOne({ id: cartId });

            if (!cart) {
                return [];
            }

            return cart;
        } catch (error) {
            console.log(`[ERROR] -> ${error}`);
        }
    }

    async addProduct(cartId, productId) {
        try {
            const selectedCart = await cartModel.findOne({ id: cartId });
    
            if (!selectedCart) {
                throw new Error('Carrito no encontrado');
            }
    
            let selectedProduct = selectedCart.products.find(product => product.product === productId);
    
            if (selectedProduct) {
                selectedProduct.quantity += 1;
                console.log('Product quantity incremented:', selectedProduct);
            } else {
                selectedCart.products.push({ product: productId, quantity: 1 });
                console.log('New product added to cart:', selectedCart.products);
            }
    
            await selectedCart.save();
            console.log('Cart saved:', selectedCart);
    
            return selectedCart; // Retorna el carrito actualizado
    
        } catch (error) {
            console.log(`[ERROR] -> ${error}`);
            throw error; // Lanza el error para el controlador manejarlo
        }
    }
    
    

}

const cartService = new CartService();

module.exports = cartService;
