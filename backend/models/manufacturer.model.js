const mongoose = require("mongoose");
const ManufacturerSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    phone: {
      type: String,
      required: true,
      minlength: 10,
    },
    password:{
      type:String,
      required:true
    },
    address: {
      type: String,
      required: true,
    },
    typeOfManufacturer: {
      type: String,
      enum: [
        "Clothing",
        "Furniture",
        "Electronics",
        "Food",
        "Toys",
        "Cosmetics",
        "Sports Equipment",
      ],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Manufacturer", ManufacturerSchema);
