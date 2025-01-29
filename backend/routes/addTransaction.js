const {addTransaction} = require('../controllers/transaction_between_manufacturer_retailer')
const express = require('express')
const transactionRouter = express.Router()
transactionRouter.post('/',addTransaction)
module.exports = transactionRouter