import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Please provide all the required fields");
  }
  const user = await User.find({ email });
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
    const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.cookie("UserToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
  return res.status(200).send({
    username: user[0].username,
    message: "User logged in successfully",
  });
};

export { login };
