const {createSupplier} = require("../controllers/supplier_controller");

const express = require("express");
const router = express.Router();

router.post('/',createSupplier)

module.exports = router;