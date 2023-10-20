const CartRepository = require('../../dao/cart/cartRepository/cartRepository');
const CustomError = require('../../services/errors/CustomError');
const EErrors = require('../../services/errors/enums');
const { generateParamErrorInfo } = require('../../services/errors/info');

class CartController {
  async getAllCarts(req, res) {
    try {
      const carts = await CartRepository.getAllCarts();
      res.json(carts);
    } catch (error) {
      res.status(500).send('Error al obtener los carritos.');
    }
  }

  async createCart(req, res) {
    try {
      const newCart = await CartRepository.createCart();
      res.json(newCart);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear carrito' });
    }
  }

  async products(req, res) {
    let cartId;

    try {
      cartId = req.params.cid;

      if (!cartId || isNaN(cartId)) {
        CustomError.createError({
          name: "Product update error",
          cause: generateParamErrorInfo(cartId),
          message: `The param is invalid`,
          code: EErrors.INVALID_TYPES_ERROR
        });
      }

      const products = await CartRepository.getProducts(cartId);
      res.json(products);
    } catch (error) {
      res.status(404).json({code: EErrors.INVALID_PARAM , cause: generateParamErrorInfo(cartId) , error: error.message });
    }
  }

  async addProduct(req, res) {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;

      if (!cartId || isNaN(cartId)) {
        CustomError.createError({
          name: "Product update error",
          cause: generateParamErrorInfo(cartId),
          message: `The param ${cartId} is invalid`,
          code: EErrors.INVALID_TYPES_ERROR
        });
      }

      const cart = await CartRepository.addProduct(cartId, productId);

      if (cart) {
        res.status(200).json({ message: 'Producto subido exitosamente!' });
      } else {
        res.status(500).json({ error: 'Error al subir el producto' });
      }
    } catch (error) {
      res.status(404).json({code: EErrors.INVALID_PARAM , cause: generateParamErrorInfo(cartId) , error: error.message });
    }
  }

  async deleteProductFromCart(req, res) {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;

      if (!cartId || isNaN(cartId)) {
        CustomError.createError({
          name: "Product update error",
          cause: generateParamErrorInfo(cartId),
          message: `The param ${cartId} is invalid`,
          code: EErrors.INVALID_TYPES_ERROR
        });
      }

      await CartRepository.deleteProduct(cartId, productId);
      res.status(200).json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({code: EErrors.INVALID_PARAM , cause: generateParamErrorInfo(cartId) , error: error.message });
    }
  }

  async deleteProductsFromCart(req, res) {
    try {
      const cartId = req.params.cid;

      if (!cartId || isNaN(cartId)) {
        CustomError.createError({
          name: "Product update error",
          cause: generateParamErrorInfo(cartId),
          message: `The param ${cartId} is invalid`,
          code: EErrors.INVALID_TYPES_ERROR
        });
      }

      await CartRepository.deleteProductsFromCart(cartId);
      res.status(200).json({ message: 'Productos eliminados exitosamente' });
    } catch (error) {
      res.status(500).json({code: EErrors.INVALID_PARAM , cause: generateParamErrorInfo(cartId) , error: error.message });
    }
  }

  async updateProductsInCart(req, res) {
    try {
      const cartId = req.params.cid;
      const { newProducts } = req.body;

      if (!cartId || isNaN(cartId)) {
        CustomError.createError({
          name: "Product update error",
          cause: generateParamErrorInfo(cartId),
          message: `The param ${cartId} is invalid`,
          code: EErrors.INVALID_TYPES_ERROR
        });
      }

      const cart = await CartRepository.updateProducts(cartId, newProducts);
      const totalPages = 1;
      const prevPage = null;
      const nextPage = null;
      const page = 1;
      const hasPrevPage = false;
      const hasNextPage = false;
      const prevLink = null;
      const nextLink = null;

      const response = {
        status: 'success',
        payload: cart,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink
      };

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({code: EErrors.INVALID_PARAM , cause: generateParamErrorInfo(cartId) , error: error.message });
    }
  }

  async updateProductsQuantity(req, res) {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const { quantity } = req.body;

      if (!cartId || isNaN(cartId)) {
        CustomError.createError({
          name: "Product update error",
          cause: generateParamErrorInfo(cartId),
          message: `The param ${cartId} is invalid`,
          code: EErrors.INVALID_TYPES_ERROR
        });
      }

      const cart = await CartRepository.updateProductsQuantity(cartId, productId, quantity);
      res.status(200).json({ message: 'Cantidad de producto actualizada exitosamente', cart });
    } catch (error) {
      res.status(500).json({code: EErrors.INVALID_PARAM , cause: generateParamErrorInfo(cartId) , error: error.message });
    }
  }

  async purchase(req, res) {
    try {
      const cartId = req.params.cid;

      if (!cartId || isNaN(cartId)) {
        CustomError.createError({
          name: "Product update error",
          cause: generateParamErrorInfo(cartId),
          message: `The param ${cartId} is invalid`,
          code: EErrors.INVALID_TYPES_ERROR
        });
      }

      const cart = await CartRepository.getCartById(cartId);
      
      if (!cart) {
        return res.status(404).json({ error: error.message});
      }

      for (const product of cart.products) {
        const productInfo = await CartRepository.getProductInfo(product.product);
        console.log(productInfo)
        if (product.quantity > productInfo.stock) {
          return res.status(400).json({ error: `No hay suficiente stock para el producto ${product.product}` });
        }

        productInfo.stock -= product.quantity;
        await CartRepository.saveProductInfo(productInfo);
      }

      await CartRepository.deleteProductsFromCart(cartId);

      res.status(200).json({ message: 'Compra realizada con éxito' });
    } catch (error) {
      res.status(500).json({code: EErrors.INVALID_PARAM , error: error.message });
    }
  }
}

module.exports = new CartController();
