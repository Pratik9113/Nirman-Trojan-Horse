const Product = require("../models/product.model");
const Manufacturer = require("../models/manufacturer.model");
const RawMaterial = require("../models/raw_material.model");


// Create and Save a new Product
const createNewProduct = async (req, res) => {
  const {
    name,
    price,
    quantity,
    manufacturer,
    raw_materials,
    product_price,
    product_quantity,
    manufacturer_id,
  } = req.body;
  if (
    !name ||
    !price ||
    !quantity ||
    !manufacturer ||
    !raw_materials ||
    !product_price ||
    !product_quantity
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

  
  const manufacturerExists = await Manufacturer.findById(manufacturer_id);

  const newProduct = new Product({
    name,
    price,
    quantity,
    raw_materials: raw_materials_array.map((raw_material) => raw_material._id),
    product_price,
    product_quantity,
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
