const {postRoute} = require("../controllers/raw.material.controller");
const express = require("express");
const RawMaterialRouter = express.Router();
RawMaterialRouter.post("/", postRoute);
module.exports = RawMaterialRouter;

