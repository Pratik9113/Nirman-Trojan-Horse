const RawMaterial = require("../models/raw_material.model");
const getRawMaterials = async (req, res) => {
    try {
        const rawMaterials = await RawMaterial.aggregate([
            {
                $group: {
                    _id: "$name", 
                    minPrice: { $min: "$price" }, 
                    details: { $push: "$$ROOT" }
                }
            },
            { $sort: { minPrice: 1 } }
        ]);
        res.status(200).json(rawMaterials);
    } catch (error) {
        res
        .status(500)
        .json({ message: "Error fetching raw materials", error: error.message });
    }
};


const postRoute = async (req, res) => {
    const {userId} = req.userId;
    const {name,quantity,price} = req.body;
    if (!name || !quantity || !price || !userId) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }
    try {
        const rawMaterial = await RawMaterial.create({
            name,
            quantity,
            price,
            raw_material_supplier:userId
        });
        res.status(201).json({ rawMaterial });
    } catch (error) {
        res.status(500).json({ message: "Error creating raw material", error: error.message });
    }
};
module.exports = { getRawMaterials, postRoute }; 
