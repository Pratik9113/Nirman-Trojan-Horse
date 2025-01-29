const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  price: { type: Number, required: true },
});

const VendorSchema = new mongoose.Schema({
  vendorPhone: { type: String, required: true }, // Vendor's phone number
  items: [ItemSchema], // Array of items the vendor supplies
});

const ShopkeeperSchema = new mongoose.Schema({
  shopkeeperId: { type: String, required: true, unique: true }, // Shopkeeper's phone number
  vendors: [VendorSchema], // List of vendors
});

module.exports = mongoose.model("Shopkeeper", ShopkeeperSchema);
