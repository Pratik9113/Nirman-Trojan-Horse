const {createNewProduct} = require("../controllers/product.controller");
const express = require("express");
const auth = require("../middlewares/auth.middleware");
const NewProductRouter = express.Router();

NewProductRouter.post("/", auth,createNewProduct);

module.exports = NewProductRouter;