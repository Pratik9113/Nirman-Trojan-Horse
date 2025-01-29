const Post = require("../models/post.model.js");
const User = require("../models/user.model.js");
const GetPost = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching posts", error: error.message });
  }
};

const GetUsers = async (req, res) => {
  try {
    const users = await User.find().select(
      "username _id email profilePic createdAt"
    );
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching Users", error: error.message });
  }
};

module.exports = { GetPost, GetUsers };
