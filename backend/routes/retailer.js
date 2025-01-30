const {addRetailer} = require('../controllers/retailer')
const express = require('express')
const retailerRouter = express.Router()
retailerRouter.post('/',addRetailer)
module.exports = retailerRouter