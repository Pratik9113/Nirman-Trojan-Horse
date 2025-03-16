const mongoose = require('mongoose');

const balanceSheetSchema = new mongoose.Schema({
    transaction_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction_between_manufacturer_retailer', required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'Retailer', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Manufacturer', required: true },
    product_details: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    total_price: { type: Number, required: true }, // Price calculated based on product price * quantity
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BalanceSheet', balanceSheetSchema);
