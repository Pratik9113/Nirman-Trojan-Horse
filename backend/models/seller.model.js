const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      minlength: [10, "Phone number must be at least 10 digits"],
      maxlength: [15, "Phone number can't exceed 15 digits"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      minlength: [5, "Address must be at least 5 characters long"],
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
      required: [true, "Type of manufacturer is required"],
    },
  },
  { timestamps: true } 
);

const Seller = mongoose.model("Seller", sellerSchema);

module.exports = Seller;
