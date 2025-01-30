const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const balanceSheetSchema = new Schema({
    entity: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'entityType' // Dynamic reference
    },
    entityType: {
        type: String,
        required: true,
        enum: ['Manufacturer', 'Retailer', 'Supplier']
    },
    totalCredit: { type: Number, default: 0 }, // Amount received
    totalDebit: { type: Number, default: 0 }, // Amount paid
    balance: { type: Number, default: 0 } // Final balance
}, {
    timestamps: true
});

const BalanceSheet = mongoose.model('BalanceSheet', balanceSheetSchema);
module.exports = BalanceSheet;
