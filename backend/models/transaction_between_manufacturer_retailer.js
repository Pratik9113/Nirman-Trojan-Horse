const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const transactionSchema = new Schema({
    buyer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Retailer'
    },
    seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Manufacturer'
    },
    product_details:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    },    

}, {
    timestamps: true
});

const Transaction = mongoose.model('Transaction_between_manufacturer_retailer', transactionSchema);

module.exports = Transaction;