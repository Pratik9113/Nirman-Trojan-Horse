const Transaction_between_manufacturer_retailer = require('../models/transaction_between_manufacturer_retailer')
const Retailer = require('../models/retailer')
const Manufacturer = require('../models/manufacturer.model')
const Product = require('../models/product.model')


const addTransaction = async (req, res) => {
    const { buyer, seller, product_details } = req.body
    console.log("req body", req.body)
    try {
        const buyerId = await Retailer.findById(buyer)
        if (!buyerId) {
            return res.status(404).send("Buyer not found")
        }
        const sellerId = await Manufacturer.findById(seller)
        if (!sellerId) {
            return res.status(404).send("Seller not found")
        }
        const productId = await Product.findById(product_details)
        if (!productId) {
            return res.status(404).send("Product not found")
        }



        const transaction = new Transaction_between_manufacturer_retailer({
            buyer:buyerId._id,
            seller:sellerId._id,
            product_details:productId._id
        })
        await transaction.save()
        res.status(201).json({message:"Transaction added successfully",transaction})
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}


module.exports = { addTransaction}