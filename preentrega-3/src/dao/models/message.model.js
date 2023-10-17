const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    user: String,
    message: String
});

const messageModel = mongoose.model("messages", messageSchema)

module.exports = messageModel