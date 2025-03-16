const mongoose = require('mongoose');
const Transaction_between_manufacturer_retailer = require('../models/transaction_between_manufacturer_retailer');
const Retailer = require('../models/retailer');
const Manufacturer = require('../models/manufacturer');
const Product = require('../models/product');
const BalanceSheet = require('../models/balance_sheet'); // Import BalanceSheet Model

const addTransaction = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { buyer, seller, product_details, quantity } = req.body;
        console.log("req body", req.body);

        // Fetch buyer (Retailer)
        const buyerDoc = await Retailer.findById(buyer).session(session);
        if (!buyerDoc) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ error: "Buyer not found" });
        }

        // Fetch seller (Manufacturer)
        const sellerDoc = await Manufacturer.findById(seller).session(session);
        if (!sellerDoc) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ error: "Seller not found" });
        }

        // Fetch product details
        const productDoc = await Product.findById(product_details).session(session);
        if (!productDoc) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ error: "Product not found" });
        }

        // Check if enough stock is available
        if (productDoc.quantity < quantity) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ error: "Not enough stock available" });
        }

        // Calculate total price (assuming product has a price field)
        const total_price = productDoc.price * quantity;

        // Create transaction
        const transaction = new Transaction_between_manufacturer_retailer({
            buyer: buyerDoc._id,
            seller: sellerDoc._id,
            product_details: productDoc._id,
            quantity
        });

        await transaction.save({ session });

        // Update product quantity
        productDoc.quantity -= quantity;
        await productDoc.save({ session });

        // Update buyer's product list
        buyerDoc.products.push(productDoc._id);
        await buyerDoc.save({ session });

        // Create balance sheet entry
        const balanceSheetEntry = new BalanceSheet({
            transaction_id: transaction._id,
            buyer: buyerDoc._id,
            seller: sellerDoc._id,
            product_details: productDoc._id,
            quantity,
            total_price
        });

        await balanceSheetEntry.save({ session });

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        console.log(transaction);
        return res.status(201).json({ message: "Transaction added successfully", transaction, balanceSheetEntry });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ error: error.message });
    }
};

module.exports = { addTransaction };
