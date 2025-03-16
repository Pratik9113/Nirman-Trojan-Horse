const {createNewProduct} = require("../controllers/product");
const express = require("express");
const auth = require("../middlewares/auth");
const NewProductRouter = express.Router();

NewProductRouter.post("/", auth,createNewProduct);

module.exports = NewProductRouter;