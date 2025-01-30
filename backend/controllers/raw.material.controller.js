const RawMaterial = require("../models/raw_material");
const RawMaterialSeller = require("../models/raw_material_seller");

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
    const {supplier_id} = req.query
    console.log("supplier id ",supplier_id)
    const {name,quantity,price} = req.body;
    if (!name || !quantity || !price) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }
    try {
        const supplier = await RawMaterialSeller.findById(supplier_id);
        const rawMaterial = await RawMaterial.create({
            name,
            quantity,
            price,
            raw_material_supplier:supplier._id
        });
        await rawMaterial.save();
        res.status(201).json({ rawMaterial });
    } catch (error) {
        res.status(500).json({ message: "Error creating raw material", error: error.message });
    }
};
module.exports = { getRawMaterials, postRoute }; 
