const Product = require("../models/product");
const Manufacturer = require("../models/manufacturer");
const RawMaterial = require("../models/raw_material");


// Create and Save a new Product
const createNewProduct = async (req, res) => {
  const {
    name,
    price,
    quantity,
    manufacturer,
    raw_materials,
    manufacturer_id,
  } = req.body;
  if (
    !name ||
    !price ||
    !quantity ||
    !manufacturer ||
    !raw_materials
  ) {
    return res.status(400).send("Please provide all the required fields");
  }

  const raw_materials_array = []
  for (const raw_material of raw_materials) {
    const raw_materialExists = await RawMaterial.findById(raw_material);
    if (!raw_materialExists) {
      return res.status(404).send("Raw material not found");
    }
    raw_materials_array.push(raw_materialExists);
  }

  
  const manufacturerExists = await Manufacturer.findById(manufacturer);

  const newProduct = new Product({
    name,
    price,
    quantity,
    raw_materials: raw_materials_array.map((raw_material) => raw_material._id),
    manufacturer: manufacturerExists,
  });
  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json(error.message);
  }
};


module.exports = { createNewProduct };
