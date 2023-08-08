const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const exphbs = require('express-handlebars');
const PORT = 8080;
const routes = require('./routes');

class Server {
    constructor() {
        this.app = express();
        this.routes();
        this.setUp();
        this.server = http.createServer(this.app);
        this.io = null;
        this.initializeSocket();
    }

    setUp(){
        this.app.set('views', './src/views');
        this.app.use(express.static('public'));
        this.app.use('/socket.io', express.static('node_modules/socket.io/client-dist')); 

        this.app.engine('handlebars', exphbs.engine());
        this.app.set('view engine', 'handlebars');

        this.app.get('/realtimeproducts', async (req, res) => {
            try {
                const pm = require('./components/products/productsService/productManager')
                const products = await pm.getProducts();
                res.render('realTimeProducts', { products });
            } catch (error) {
                console.log(`[ERROR] -> ${error}`);
                res.status(500).json({ error: 'Error al obtener los productos' });
            }
        });
    }

    initializeSocket() {
        this.io = socketIO(this.server);
    
        const pm = require('./components/products/productsService/productManager');
    
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
    }
    

    routes() {
        routes(this.app);
    }

    listen() {
        this.server.listen(PORT, () => { console.log(`http://localhost:${PORT}`) });
    }
}


module.exports = new Server(), socketIO;


