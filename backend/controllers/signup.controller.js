const Manufacturer = require("../models/manufacturer.model");
const cloudinary = require("cloudinary").v2;

const signup = async (req, res) => {
  try {
    // if (!req.file) {
    //   return res.status(400).json({ message: "Profile image is required" });
    // }
    // const uploadResult = await cloudinary.uploader.upload(req.file.path);
    // console.log("Cloudinary upload result:", uploadResult);
    const { address, email, password, phone_number,manufacturer_type} = req.body;
    if ( !email || !password || !address || !phone_number || !manufacturer_type) {
      return res.status(400).send("Please provide all the required fields");
    }
    const existingUser = await Manufacturer.findOne({ email });
    if (existingUser) {
      return res.status(409).send("Manfacturer already exists");
    }
    // console.log(uploadResult);
    // console.log(uploadResult.secure_url);
    const newManufacturer = new Manufacturer({
      address,
      email,
      password,
      phone:phone_number,
      typeOfManufacturer:manufacturer_type
    });
    await newManufacturer.save();

    res.status(201).send("Manufacturer created successfully");
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = signup;
