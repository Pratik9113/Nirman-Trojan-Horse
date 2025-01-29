import User from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";

const signup = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Profile image is required" });
    }
    const uploadResult = await cloudinary.uploader.upload(req.file.path);
    console.log("Cloudinary upload result:", uploadResult);
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).send("Please provide all the required fields");
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send("User already exists");
    }
    console.log(uploadResult);
    console.log(uploadResult.secure_url);
    const newUser = new User({
      username,
      email,
      password,
      profilePic: uploadResult.secure_url,
    });
    await newUser.save();

    res.status(201).send("User created successfully");
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).send("Internal Server Error");
  }
};


export { signup };
