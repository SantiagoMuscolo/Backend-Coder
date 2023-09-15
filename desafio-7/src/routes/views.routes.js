const express = require('express');
const exphbs = require('express-handlebars');
const PM = require('../dao/products/productsService/productManager');
const userManager = require('../dao/users/userService/userService')

module.exports = (app) => {
        app.set('views', './src/views');
        app.use(express.static('public'));

        app.engine('handlebars', exphbs.engine());
        app.set('view engine', 'handlebars');

        // app.get('/', async (req, res) => {
        //     const products = await PM.getProducts()
        //     console.log(products)
        //     res.render('home', { products })
        // });

        app.get('/realtimeproducts', async (req, res) => {
            try {
                const pm = require('../dao/products/productsService/productManager')
                const products = await pm.getProducts();
                res.render('realTimeProducts', { products });
            } catch (error) {
                console.log(`[ERROR] -> ${error}`);
                res.status(500).json({ error: 'Error al obtener los productos' });
            }
        });

        
        app.get('/products', async (req, res) => {
            try {
                const pm = require('../dao/products/productsService/productManager');
                const query = req.query.query;
                const limit = parseInt(req.query.limit) || 10;
                const page = parseInt(req.query.page) || 1;
                const sort = req.query.sort === 'desc' ? -1 : 1;
                let products = await pm.getProducts();

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

                res.render('products', {
                    products: paginatedProducts,
                    hasPrevPage: hasPrevPage,
                    hasNextPage: hasNextPage,
                    nextPageLink: hasNextPage ? `${req.baseUrl}?limit=${limit}&page=${page + 1}` : null,
                    prevPageLink: hasPrevPage ? `${req.baseUrl}?limit=${limit}&page=${page - 1}` : null,
                    page: page
                });
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
                    res.render('productDetails', { product });
                    console.log(product)
                } else {
                    res.status(404).json({ error: 'Producto no encontrado' });
                }
            } catch (error) {
                console.log(`[ERROR] -> ${error}`);
                res.status(500).json({ error: 'Error al obtener el producto' });
            }
        });

        app.get('/carts/:cid', async (req, res) => {
            try {
                const cart = require('../dao/cart/cartService/cartService');
                const cartId = req.params.cid;
                const cartItems = await cart.getProducts(cartId)

                if (cartItems) {
                    res.render('cart', { cartItems });
                } else {
                    res.status(404).json({ error: 'Producto no encontrado' });
                }

            } catch (error) {
                console.log(`[ERROR] -> ${error}`);
                res.status(500).json({ error: 'Error al obtener los detalles del carrito' });
            }
        });

        app.get('/chatHandlebars', async (req, res) => {
            res.render('chat', {})
        })

        app.get('/sessions', (req, res) => {
            res.render('session')
        });

        app.get('/', (req, res) => {
            res.render('login')
        });

        app.get('/register', (req, res) => {
            res.render('register')
        })

        // app.get('/profile', (req, res) => {
        //     res.render('profile')
        // })
}