const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const transactionSchema = new Schema({
    buyer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Retailer'
    },
    product_details:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    },
    quantity:{
        type:Number,
        required:true
    }, 

}, {
    timestamps: true
});

const Transaction = mongoose.model('Transaction_between_retailer_buyer', transactionSchema);

module.exports = Transaction;