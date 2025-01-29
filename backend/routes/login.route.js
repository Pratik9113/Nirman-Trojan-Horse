import express from "express";
import { login } from "../controllers/login.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
const LoginRouter = express.Router();
LoginRouter.post("/", login);
export default LoginRouter;