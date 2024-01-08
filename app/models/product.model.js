const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    price: {
        type: Number,
        trim: true,
        required: true
    },
    description: {
        type: String
    },
    image: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        default: 0
    },
    sold: {
        type: Number,
        default: 0
    },
    position: {
        type: Number,
        default: 1
    }
}, {
    timestamps: true //important
})


module.exports = mongoose.model("Products", productSchema)