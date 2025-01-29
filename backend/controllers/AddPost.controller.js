const Post = require("../models/post.model");
const User = require("../models/user.model");

const AddPost = async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).send("Please provide all the required fields");
  }
  try {
    const post = new Post({
      userId: req.userId,
      title,
      description,
    });
    const SavedPost = await post.save();

    await User.findByIdAndUpdate(
      req.userId,
      { $push: { post: SavedPost._id } },
      { new: true }
    );

    res.status(201).send("Post Added Successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = AddPost;
