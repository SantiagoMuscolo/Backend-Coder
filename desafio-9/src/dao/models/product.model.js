const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    id: Number,
    title: String,
    description: String,
    price: Number,
    thumbnails: Array,
    code: String,
    stock: Number
});

const productModel = mongoose.model("products", productSchema)

module.exports = productModel, productSchema