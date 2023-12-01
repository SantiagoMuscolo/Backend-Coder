const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    role: String,
    isPremium: Boolean,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts',
    },
    documents: [
        {
            name: String,
            reference: String,
        }
    ],
    last_connection: Date,
})

userSchema.pre(/^find/, function (next) {
    this.populate('cart');
    next();
})

userSchema.methods.updateLastConnection = function () {
    this.last_connection = new Date();
    return this.save();
};

const userModel = mongoose.model('users', userSchema);

module.exports = userModel