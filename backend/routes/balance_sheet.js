const mongoose = require('mongoose');


transactionSchema.post('save', async function (doc) {
    const BalanceSheet = require('./BalanceSheet');

    try {
        // Seller gets credit, Buyer gets debit
        const { buyer, seller, quantity, product_details } = doc;
        const Product = require('./Product');
        const product = await Product.findById(product_details);
        const transactionAmount = product.price * quantity; // Assuming 'price' field exists

        // Update seller balance
        await BalanceSheet.findOneAndUpdate(
            { entity: seller },
            {
                $inc: { totalCredit: transactionAmount, balance: transactionAmount }
            },
            { upsert: true, new: true }
        );

        // Update buyer balance
        await BalanceSheet.findOneAndUpdate(
            { entity: buyer },
            {
                $inc: { totalDebit: transactionAmount, balance: -transactionAmount }
            },
            { upsert: true, new: true }
        );

    } catch (error) {
        console.error('Error updating balance sheet:', error);
    }
});
