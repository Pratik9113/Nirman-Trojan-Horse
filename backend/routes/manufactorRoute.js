const express = require("express");
const { getData } = require("../controllers/manufactorController.js");
const manufacturerRoute = express.Router();
manufacturerRoute.post("/get-data-from-manufacturer", getData);
module.exports = manufacturerRoute;
