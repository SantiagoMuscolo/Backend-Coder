const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    id:Number,
    products:{
        type:[
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products' 
                },
                quantity: {
                    type: Number,
                    default: 0
                }
            }
        ]
    }
});

cartSchema.pre("findOne", function() {
    this.populate("products.product");
});

const cartModel = mongoose.model("carts", cartSchema)

module.exports = cartModel