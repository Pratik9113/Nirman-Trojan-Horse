import express from "express";
import { signup } from "../controllers/signup.controller.js";
import upload from "../middlewares/multer.middleware.js";

const SignupRouter = express.Router();
SignupRouter.post("/", upload.single("image"), signup);
export default SignupRouter;
