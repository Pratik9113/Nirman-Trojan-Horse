const mongoose = require("mongoose");
const RawMaterialSellerSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    name:{
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      minlength: 10,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    // raw_materials: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "RawMaterial",
    //   },
    // ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("RawMaterialSeller", RawMaterialSellerSchema);
