const jwt = require("jsonwebtoken");
const Manufacturer = require("../models/manufacturer");

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Please provide all the required fields");
  }
  const user = await Manufacturer.find({ email });
  if (!user.length) {
    return res.status(404).send("User not found");
  }
  try {
    if (user[0].password !== password) {
      return res.status(401).send("Invalid credentials");
    }

    const data = {
      userId: user[0]._id,
    };
    const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.cookie("UserToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge:1000*60*60*24
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
  return res.status(200).json({
    username: user[0].email,
    message: "User logged in successfully",
  });
};

module.exports = { login };
