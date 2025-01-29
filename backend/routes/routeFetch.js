const express = require("express");
const deliverySchemaModel = require("../models/retailer.js");
const routeFetch = express.Router();


routeFetch.get("/fetch-orders", async(req, res)=>{
    try {
        const order = await deliverySchemaModel.find({status:"pending"}).sort({orderTime:1}).limit(10);
        res.json({success:true,order});
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = routeFetch