const express = require("express");
const test = require("../controllers/test.controller");
const TestRouter = express.Router();
TestRouter.get("/", test);
module.exports = TestRouter;
