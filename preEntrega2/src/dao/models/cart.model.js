const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    product: Number,
    quantity: Number
});

const cartSchema = mongoose.Schema({
    id: Number,
    products: [productSchema]
});


const cartModel = mongoose.model("carts", cartSchema)

module.exports = cartModel