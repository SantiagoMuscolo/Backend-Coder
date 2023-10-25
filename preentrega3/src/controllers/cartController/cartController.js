const CartRepository = require('../../dao/cart/cartRepository/cartRepository');
const ProductRepository = require('../../dao/products/productRepository/productRepository')
const querystring = require('querystring');

const productRepository = new ProductRepository();

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

  async getCart(req, res) {
    try {
      const cartId = req.user.cart.id;
      console.log(cartId);
      const products = await CartRepository.getCart(cartId);
      res.json(products);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async addProduct(req, res) {
    try {
      console.log(req.user)
      const cartId = req.user?.user.cart._id;
      const productId = req.body.id;
      const cart = await CartRepository.addProductToCart(cartId, productId);

      if (cart) res.status(200).json({ message: 'Producto subido exitosamente!' });
      else res.status(500).json({ error: 'Error al subir el producto' });

    } catch (error) {
      console.log('error uwu');
      res.status(404).json({ message: error.message });
    }
  }

  async deleteProductFromCart(req, res) {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      await CartRepository.deleteProduct(cartId, productId);
      res.status(200).json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el producto' });
    }
  }

  async deleteProductsFromCart(req, res) {
    try {
      const cartId = req.params.cid;
      await CartRepository.deleteProductsFromCart(cartId);
      res.status(200).json({ message: 'Productos eliminados exitosamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateProductsInCart(req, res) {
    try {
      const cartId = req.params.cid;
      const { newProducts } = req.body;
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
      res.status(500).json({ status: 'error', message: `${error}` });
    }
  }

  async updateProductsQuantity(req, res) {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const { quantity } = req.body;
      const cart = await CartRepository.updateProductsQuantity(cartId, productId, quantity);
      res.status(200).json({ message: 'Cantidad de producto actualizada exitosamente', cart });
    } catch (error) {
      res.status(500).json({ error: `${error}` });
    }
  }

  async products(req, res) {
    try {
        const cartId = req.params.cid;

        const products = await CartRepository.getProducts(cartId);

        res.json(products);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

  async purchase(req, res) {
    try {
      const cartId = req.params.cid;
      const cart = await CartRepository.getProducts(cartId);

      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }

      for (const product of cart) {
        const productInfo = product.product;
        console.log(productInfo._id)
        console.log(productInfo)
        if (product.quantity > productInfo.stock) {
          return res.status(400).json({ error: `No hay suficiente stock para el producto ${product.product}` });
        }

        productInfo.stock -= product.quantity;
        
        await productRepository.updateProduct(productInfo._id , productInfo);
      }

      await CartRepository.deleteProductsFromCart(cartId);

      res.status(200).json({ message: 'Compra realizada con éxito' });
    } catch (error) {
      res.status(500).json({ error: 'Error al procesar la compra' });
    }
  }
}

module.exports = new CartController();
