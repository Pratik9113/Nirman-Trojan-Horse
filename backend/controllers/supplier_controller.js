const RawMaterialSellerSchema = require('../models/raw_material_seller.model');
const createSupplier = async (req, res) => {
    try {
        const { email, phone, password, address, raw_materials,name } = req.body;
        const newSupplier = new RawMaterialSellerSchema({
            name,
            email,
            phone,
            password,
            address,
            raw_materials
        });
        await newSupplier.save();
        res.status(201).json({ message: 'Supplier created successfully', supplier: newSupplier });
    } catch (error) {
        res.status(500).json({ message: 'Error creating supplier', error });
    }
};


module.exports = { createSupplier };