import express from "express";
import { test } from "../controllers/test.controller.js";
const TestRouter = express.Router();
TestRouter.get("/", test);
export default TestRouter;
