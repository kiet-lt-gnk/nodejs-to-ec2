const mongoose = require('mongoose')


const transactionSchema = new mongoose.Schema({
    productID: { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
    amout: {
        type: Number,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
}, {
    timestamps: true //important
})


module.exports = mongoose.model("Transaction", transactionSchema)