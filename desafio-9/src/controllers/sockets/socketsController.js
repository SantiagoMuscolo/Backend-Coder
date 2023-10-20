const socketIO = require('socket.io');
const pm = require('../../dao/products/productsService/productManager');
const messageModel = require('../../dao/models/message.model');

const messages = [];

function configureSockets(server) {
  const io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('Cliente conectado');

    pm.getProducts()
      .then((products) => {
        socket.emit('initial products', products);

        socket.on('new product', (newProduct) => {
          console.log('Nuevo producto recibido:', newProduct);
          io.emit('new product', newProduct);
        });

        socket.on('delete product', (productId) => {
          console.log('Nuevo producto eliminado:', productId);
          io.emit('delete product', productId);
        });
      })
      .catch((error) => {
        console.log(`[ERROR] -> ${error}`);
      });
  });

  io.on("connection", (socket) => {
    console.log("Nueva Conexión!");
    socket.broadcast.emit("nuevaConexion", "Hay un nuevo Usuario conectado!");

    socket.on("nuevoUsuario", (data) => {
      socket.broadcast.emit("nuevoUsuario", data + " se ha conectado!");
    });


    socket.on("message", async (data) => {
      messages.push({ usuario: data.usuario, foto: data.foto, mensaje: data.mensaje });
      socket.emit("messages", messages);

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

module.exports = configureSockets;