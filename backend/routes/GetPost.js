const express = require("express");
const { auth } = require("../middlewares/auth");
const { GetPost, GetUsers } = require("../controllers/GetPost");

const GetPostRouter = express.Router();
GetPostRouter.get("/getpost", auth, GetPost);
GetPostRouter.get("/getusers", auth, GetUsers);
module.exports = GetPostRouter;
