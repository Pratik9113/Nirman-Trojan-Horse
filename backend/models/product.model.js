const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    manufacturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Manufacturer",
    },
    raw_materials: [
      { type: mongoose.Schema.Types.ObjectId, ref: "RawMaterial" },
    ],  
  },
  { timestamps: true }
);
module.exports = mongoose.model("Product", ProductSchema);
