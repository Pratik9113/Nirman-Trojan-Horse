const express = require("express");
const AddPost = require("../controllers/AddPost.controller");
const { auth } = require("../middlewares/auth.middleware");
const AddPostRouter = express.Router();
AddPostRouter.post("/addpost", auth, AddPost);
module.exports = AddPostRouter;
