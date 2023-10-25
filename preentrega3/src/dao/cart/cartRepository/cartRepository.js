const CartModel = require('../../models/cart.model');

class CartRepository {
  async getAllCarts() {
    try {
      return CartModel.find().populate('products.product').lean();
    } catch (error) {
      throw error;
    }
  }

  async createCart() {
    try {
      const newCart = await CartModel.create({ products: [] });
      const cartId = newCart._id;
      return cartId;
    } catch (error) {
      throw error;
    }
  }

  async getCart(cartId) {
    try {
      const cart = await CartModel.findOne({ _id: cartId }).lean();
      console.log('llegue aca');
      console.log(cart, 'carrito');
      if (!cart) {
        return [];
      }

      return cart.products;
    } catch (error) {
      throw error;
    }
  }

  async getProducts(cartId) {
    try {
      console.log(cartId)
        const cart = await CartModel.findOne({ _id: cartId }).populate("products.product").lean();

        if (!cart) {
            return [];
        }

        return cart.products;
    } catch (error) {
        console.log(`[ERROR] -> ${error}`);
    }
}

async getProductInfo(productId) {
  try {
    const productInfo = await CartModel.findById(productId).lean();
    return productInfo;
  } catch (error) {
    throw error;
  }
}

  async addProductToCart(cartId, productId) {
    try {
      const cart = await CartModel.findOne({ _id: cartId });
      if (!cart) throw new Error('Carrito no encontrado');
      const existingProduct = cart.products.find((product) => product.product._id.toString() === productId);

      if (existingProduct) existingProduct.quantity += 1;
      else cart.products.push({ product: productId, quantity: 1 });

      await cart.save();

      return cart;
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(cartId, productId) {
    try {
      const cart = await CartModel.findOne({ _id: cartId });

      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      const productIndex = cart.products.findIndex((product) => product.product.toString() === productId);

      if (productIndex === -1) {
        throw new Error('Producto no encontrado en el carrito');
      }

      cart.products.splice(productIndex, 1);

      await cart.save();

      return cart;
    } catch (error) {
      throw error;
    }
  }

  async deleteProductsFromCart(cartId) {
    try {
      const cart = await CartModel.findOne({ _id: cartId });

      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      cart.products = [];

      await cart.save();
    } catch (error) {
      throw error;
    }
  }

  async updateProductsQuantity(cartId, productId, newQuantity) {
    try {
      const cart = await CartModel.findOne({ _id: cartId });

      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      const productIndex = cart.products.findIndex((product) => product.product.toString() === productId);

      if (productIndex === -1) {
        throw new Error('Producto no encontrado en el carrito');
      }

      cart.products[productIndex].quantity = newQuantity;

      await cart.save();

      return cart;
    } catch (error) {
      throw error;
    }
  }

  async updateProducts(cartId, newProducts) {
    try {
      const cart = await CartModel.findOne({ _id: cartId });

      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      const formattedProducts = newProducts.map((product) => ({
        product: product._id,
        quantity: product.quantity,
      }));

      cart.products = formattedProducts;

      await cart.save();

      return cart;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new CartRepository();
