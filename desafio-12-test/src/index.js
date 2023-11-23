const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const exphbs = require('express-handlebars');
const PORT = 8080;
const routes = require('./routes');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const configureSockets = require('./controllers/sockets/socketsController');
const addLoger = require('./utils/logger')
const { environment } = require('./config/config');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
require('dotenv').config()

const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: "Documentacion API para backend coderhouse",
      description: "Documentacion del uso de la API ecommerce para coderhouse"
    }
  },
  apis: [`./src/docs/**/*.yaml`], 
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

class Server {
  constructor() {
    this.app = express();
    this.routes();
    this.setUp();
    this.server = http.createServer(this.app);
    this.io = null;
    this.initializeSocket();
  }

  setUp() {
    this.app.use(cookieParser());
    this.app.set('views', './src/views');
    this.app.use(express.static('public'));
    this.app.use('/socket.io', express.static('node_modules/socket.io/client-dist'));
    this.app.engine('handlebars', exphbs.engine());
    this.app.set("views", __dirname + "/views");
    this.app.set("view engine", "handlebars");
    this.app.use(express.static(__dirname + "/public"));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(addLoger)
    this.app.use('/apidocs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

    this.app.get("/loggerTest", (req, res) => {
      req.logger?.http("Alerta")
      res.send({message: "Prueba de logger!"})
  })
  }

  initializeSocket() {
    configureSockets(this.server)
  }

  routes() {
    routes(this.app);
  }

  listen() {
    this.server.listen(PORT, () => { console.log(`http://localhost:${PORT}`) });
    mongoose.connect(process.env.MONGO_URL);
  }
}

module.exports = new Server(), socketIO;


