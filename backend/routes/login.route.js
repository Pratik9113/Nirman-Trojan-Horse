const express = require("express");
const { login } = require("../controllers/login.controller.js");
const {auth} = require("../middlewares/auth.middleware");
const LoginRouter = express.Router();
LoginRouter.post("/", login);
module.exports = LoginRouter;