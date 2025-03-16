const express = require("express");
const { login } = require("../controllers/login");
const {auth} = require("../middlewares/auth");
const LoginRouter = express.Router();
LoginRouter.post("/", login);
module.exports = LoginRouter;