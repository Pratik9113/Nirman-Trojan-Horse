const mongoose = require('mongoose');
const createSupplier = async (req, res) => {
    try {
        const { email, phone, password, address, raw_materials } = req.body;
        const newSupplier = new RawMaterialSellerSchema({
            email,
            phone,
            password,
            address,
            typeOfRawMaterialSeller: "Raw Material Seller",
            raw_materials
        });
        await newSupplier.save();
        res.status(201).json({ message: 'Supplier created successfully', supplier: newSupplier });
    } catch (error) {
        res.status(500).json({ message: 'Error creating supplier', error });
    }
};


module.exports = { createSupplier };