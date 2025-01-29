import express from "express";
import { AddPost } from "../controllers/AddPost.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
const AddPostRouter = express.Router();
AddPostRouter.post("/addpost",auth,AddPost);
export default AddPostRouter;
