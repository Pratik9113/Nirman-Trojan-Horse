const mongoose = require("mongoose");
const RawMaterialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    raw_material_supplier:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "RawMaterialSupplier",
    },
    // products: [
    //   { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    // ],
    photo_url:{
      type:String,
      required:false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("RawMaterial", RawMaterialSchema);