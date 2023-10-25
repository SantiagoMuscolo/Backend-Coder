const express = require('express');
const exphbs = require('express-handlebars');
const passport = require('passport');
const initializePassport = require('../config/passport.config');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cart = require('../dao/cart/cartRepository/cartRepository');
const validateToken = require('../middlewares/validateToken');
const cookieParser = require('cookie-parser');
require('dotenv').config()

module.exports = (app) => {
  app.use(session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 24 * 60 * 60
    }),
    secret: process.env.MONGO_SECRET,
    resave: false,
    saveUninitialized: true
  }));
  initializePassport();
  app.use(passport.initialize());
  app.use(passport.session());
  app.set('views', './src/views');
  app.use(express.static('public'));
  app.use(cookieParser());

  app.engine('handlebars', exphbs.engine());
  app.set('view engine', 'handlebars');

  app.get('/realtimeproducts', async (req, res) => {
    try {
      if (req.isAuthenticated()) {
        const pm = require('../dao/products/productsService/productManager')
        const products = await pm.getProducts();
        res.render('products/realTimeProducts', { products });
      } else {
        res.redirect('/')
      }
    } catch (error) {
      console.log(`[ERROR] -> ${error}`);
      res.status(500).json({ error: 'Error al obtener los productos' });
    }
  });


  app.get('/products', async (req, res) => {
    try {
      if (req.isAuthenticated()) {
        const pm = require('../dao/products/productsService/productManager');
        const query = req.query.query;
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort === 'desc' ? -1 : 1;
        let products = await pm.getProducts();
        products = products.map(product => ({ ...product, id: product._id }));
        
        if (query) {
          products = products.filter(product => {
            return product.name.includes(query);
          });
        }

        products.sort((a, b) => (a.price - b.price) * sort);

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedProducts = products.slice(startIndex, endIndex);
        const totalPages = Math.ceil(products.length / limit);
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;

        res.render('products/products', {
          products: paginatedProducts,
          hasPrevPage: hasPrevPage,
          hasNextPage: hasNextPage,
          nextPageLink: hasNextPage ? `${req.baseUrl}?limit=${limit}&page=${page + 1}` : null,
          prevPageLink: hasPrevPage ? `${req.baseUrl}?limit=${limit}&page=${page - 1}` : null,
          page: page
        });
      } else {
        res.redirect('/')
      }
    } catch (error) {
      console.log(`[ERROR] -> ${error}`);
      res.status(500).json({ error: 'Error al obtener los productos' });
    }
  });

  app.get('/products/:productId', async (req, res) => {
    try {
      const pm = require('../dao/products/productsService/productManager');
      const productId = parseInt(req.params.productId);
      const product = await pm.getProductById(productId);

      if (product) {
        res.render('products/productDetails', { product });
        console.log(product)
      } else {
        res.status(404).json({ error: 'Producto no encontrado' });
      }
    } catch (error) {
      console.log(`[ERROR] -> ${error}`);
      res.status(500).json({ error: 'Error al obtener el producto' });
    }
  });

  app.get('/carts', validateToken, async (req, res) => {
    try {
      const cartId = req.user.cart;
      const cartItems = await cart.getCart(cartId)

      if (cartItems) res.render('cart/cart', { cartItems });
      else res.status(404).json({ error: 'Producto no encontrado' });
    } catch (error) {
      console.log(`[ERROR] -> ${error}`);
      res.status(500).json({ error: 'Error al obtener los detalles del carrito' });
    }
  });

  app.get('/chatHandlebars', async (req, res) => {
    res.render('chat/chat', {})
  })

  app.get('/sessions', (req, res) => {
    res.render('user/session')
  });

  app.get('/', (req, res) => {
    res.render('user/login')
  });

  app.get('/register', (req, res) => {
    res.render('user/register')
  })

  app.get("/faillogin", async (req, res) => {
    res.send({ status: "error", message: "Login inválido!" });
  });

  app.get("/failregister", async (req, res) => {
    res.send({ status: "Error", message: "Error! No se pudo registar el Usuario!" });
  });

  app.get('/profile', (req, res) => {
    if (req.isAuthenticated()) {
      const user = req.user;
      res.render('user/profile', { ...user });
    } else {
      res.redirect('/');
    }
  });

  app.get('/checkout', (req, res) => {
    res.render('cart/success')
  });
}