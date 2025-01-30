const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'toModel' // Dynamic reference
    },
    toModel: {
        type: String,
        required: true,
        enum: ['Supplier', 'Manufacturer', 'Retailer'] // Allowed models
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'fromModel' // Dynamic reference
    },
    fromModel: {
        type: String,
        required: true,
        enum: ['Supplier', 'Manufacturer', 'Retailer'] // Allowed models
    },
    status: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['credit', 'debit'],
        required: true
    }
}, {
    timestamps: true
});

const Transactions = mongoose.model('Transactions', transactionSchema);
module.exports = Transactions;
