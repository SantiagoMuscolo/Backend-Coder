const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    id: Number,
    title: String,
    description: String,
    price: Number,
    thumbnails: Array,
    code: String,
    stock: Number,
    owner: {
        type: mongoose.Schema.Types.String,
        ref: 'users'
    }
});

productSchema.pre('save', function (next) {
    if (!this.owner) {
        this.owner = 'admin';
    }
    next();
});
const productModel = mongoose.model("products", productSchema)
module.exports = productModel