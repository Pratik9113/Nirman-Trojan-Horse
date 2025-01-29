import Post from "../models/post.model.js";
import User from "../models/user.model.js";
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

export { GetPost, GetUsers };
