import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { GetPost, GetUsers } from "../controllers/GetPost.controller.js";
const GetPostRouter = express.Router();
GetPostRouter.get("/getpost", auth, GetPost);
GetPostRouter.get("/getusers", auth, GetUsers);
export default GetPostRouter;
