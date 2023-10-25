const cartModel = require("../../models/cart.model");
const mongoose = require("mongoose");

class CartService {
  static id = 0;

  constructor() {
    this.carritos = [];
  }

  getAllCarts() {
    try {
      return cartModel.find().populate("products.product").lean();
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
      const cart = await cartModel.findOne({ id: cartId }).populate("products.product").lean();
      console.log(cart);
      if (!cart) {
        return [];
      }

      return cart.products;
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

      return selectedCart;

    } catch (error) {
      console.log(`[ERROR] -> ${error}`);
      throw error;
    }
  }

  async getProductByIdFromCart(cartId, productId) {
    try {
      const selectedCart = await cartModel.findOne({ id: cartId });
      let selectedProduct = selectedCart.products.find(product => product.product === productId);

      console.log(selectedProduct)

      return selectedProduct
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(cartId, productId) {
    try {
      const cart = await cartModel.findOne({ id: cartId });

      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      const productIndex = cart.products.findIndex(product => product.product === productId);

      if (productIndex === -1) {
        throw new Error('Producto no encontrado en el carrito');
      }

      cart.products.splice(productIndex, 1);

      await cart.save();

      return cart;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteProductsFromCart(cartId) {
    try {
      const cart = await cartModel.findOne({ id: cartId });

      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      cart.products = [];

      await cart.save();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateProductsQuantity(cartId, productId, newQuantity) {
    try {
      const cart = await cartModel.findOne({ id: cartId });

      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      const productIndex = cart.products.findIndex(product => product.product === productId);

      if (productIndex === -1) {
        throw new Error('Producto no encontrado en el carrito');
      }

      cart.products[productIndex].quantity = newQuantity;

      await cart.save();

      return cart;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateProducts(cartId, newProducts) {
    try {
      const selectedCart = await cartModel.findOne({ id: cartId });

      if (!selectedCart) {
        throw new Error('Carrito no encontrado');
      }

      const formattedProducts = newProducts.map(product => ({
        product: product._id,
        quantity: product.quantity
      }));

      selectedCart.products = formattedProducts;

      await selectedCart.save();

      return selectedCart;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

}

const cartService = new CartService();

module.exports = cartService;