const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    role: String,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts',
    }
})

userSchema.pre(/^find/, function (next) {
    this.populate('cart');
    next();
})

const userModel = mongoose.model('users', userSchema);

module.exports = userModel