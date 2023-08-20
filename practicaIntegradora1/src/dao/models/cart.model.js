const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    id: Number,
    proucts: Array
});

const cartModel = mongoose.model("carts", cartSchema)

module.exports = cartModel