const Post = require("../models/post.model");

const post = async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).send("Please provide all the required fields");
  }
  try {
    const post = new Post({
      title,
      description,
    });
    res.status(201).send("Post Added Successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
};
export { post };
