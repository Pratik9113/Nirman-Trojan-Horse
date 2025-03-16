const express = require("express");
const test = require("../controllers/test");
const TestRouter = express.Router();
TestRouter.get("/", test);
module.exports = TestRouter;
