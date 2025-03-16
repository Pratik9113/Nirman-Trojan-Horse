const express = require("express");
const signup = require("../controllers/manufacture_signup");
const upload = require("../middlewares/multer");

const SignupRouter = express.Router();
SignupRouter.post("/", upload.single("image"), signup);
module.exports = SignupRouter;
