const Retailer = require('../models/retailer')

const addRetailer = async (req, res) => {
    const { email, phone, password, address,name } = req.body
    try {
        const retailer = new Retailer({
            name,
            email,
            phone,
            password,
            address
        })
        await retailer.save()
        res.status(201).json({ message: "Retailer added successfully", retailer })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = { addRetailer }