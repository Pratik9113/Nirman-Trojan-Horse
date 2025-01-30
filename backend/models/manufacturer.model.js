const mongoose = require("mongoose");
const ManufacturerSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    name: {
      type: String,
      required: true,
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
    products:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Manufacturer", ManufacturerSchema);
