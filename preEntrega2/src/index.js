const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const exphbs = require('express-handlebars');
const PORT = 8080;
const routes = require('./routes');
const mongoose = require('mongoose');
const messageModel = require('./dao/models/message.model')

class Server {
    constructor() {
        this.app = express();
        this.routes();
        this.setUp();
        this.server = http.createServer(this.app);
        this.io = null;
        this.initializeSocket();
        this.messages = [];
    }

    setUp() {
        this.app.set('views', './src/views');
        this.app.use(express.static('public'));
        this.app.use('/socket.io', express.static('node_modules/socket.io/client-dist'));

        this.app.engine('handlebars', exphbs.engine());
        this.app.set("views", __dirname + "/views");
        this.app.set("view engine", "handlebars");
        this.app.use(express.static(__dirname + "/public"));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));


        this.app.get('/realtimeproducts', async (req, res) => {
            try {
                const pm = require('./dao/products/productsService/productManager')
                const products = await pm.getProducts();
                res.render('realTimeProducts', { products });
            } catch (error) {
                console.log(`[ERROR] -> ${error}`);
                res.status(500).json({ error: 'Error al obtener los productos' });
            }
        });

        this.app.get('/products', async (req, res) => {
            try {
                const pm = require('./dao/products/productsService/productManager');
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

        this.app.get('/products/:productId', async (req, res) => {
            try {
                const pm = require('./dao/products/productsService/productManager');
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

        this.app.get('/carts/:cid', async (req, res) => {
            try {
                const cart = require('./dao/cart/cartService/cartService');
                const cartId = req.params.cid;
                const cartItems = await cart.getProducts(cartId)

                if (cartItems) {
                    console.log("Cart Items:", cartItems);
                    res.render('cart', { cartItems });
                } else {
                    res.status(404).json({ error: 'Producto no encontrado' });
                }

            } catch (error) {
                console.log(`[ERROR] -> ${error}`);
                res.status(500).json({ error: 'Error al obtener los detalles del carrito' });
            }
        });

        this.app.get('/chatHandlebars', async (req, res) => {
            res.render('chat', {})
        })
    }

    initializeSocket() {
        this.io = socketIO(this.server);

        const pm = require('./dao/products/productsService/productManager');

        this.io.on('connection', (socket) => {
            console.log('Cliente conectado');

            pm.getProducts()
                .then((products) => {
                    socket.emit('initial products', products);

                    socket.on('new product', (newProduct) => {
                        console.log('Nuevo producto recibido:', newProduct);
                        this.io.emit('new product', newProduct);
                    });

                    socket.on('delete product', (productId) => {
                        console.log('Nuevo producto eliminado:', productId);
                        this.io.emit('delete product', productId);
                    });
                })
                .catch((error) => {
                    console.log(`[ERROR] -> ${error}`);
                });
        });

        this.io.on("connection", (socket) => {
            console.log("Nueva Conexión!");
            socket.broadcast.emit("nuevaConexion", "Hay un nuevo Usuario conectado!");

            socket.on("nuevoUsuario", (data) => {
                socket.broadcast.emit("nuevoUsuario", data + " se ha conectado!");
            });

            socket.on("message", async (data) => {
                this.messages.push({ usuario: data.usuario, foto: data.foto, mensaje: data.mensaje });
                socket.emit("messages", this.messages);

                // Save the message to the database using Mongoose
                const newMessage = new messageModel({
                    user: data.usuario,
                    message: data.mensaje
                });
                try {
                    await newMessage.save();
                    console.log("Message saved to the database:", newMessage);
                } catch (error) {
                    console.error("Error saving message to the database:", error);
                }
            });
        });
    }


    routes() {
        routes(this.app);
    }

    listen() {
        this.server.listen(PORT, () => { console.log(`http://localhost:${PORT}`) });
        mongoose.connect("mongodb+srv://santiagoMuscolo:Sanlorenzo2003@codecluster.cjqx2s9.mongodb.net/ecommerce?retryWrites=true&w=majority")
    }
}


module.exports = new Server(), socketIO;


