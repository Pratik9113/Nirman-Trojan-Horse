const express = require("express");
const signup = require("../controllers/signup.controller");
const upload = require("../middlewares/multer.middleware");

const SignupRouter = express.Router();
SignupRouter.post("/", upload.single("image"), signup);
module.exports = SignupRouter;
