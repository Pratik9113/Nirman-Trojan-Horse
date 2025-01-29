const mongoose = require("mongoose")
const BookRetailer = new mongoose.Schema({
    email:{type:String, required:true},
    phno:{type:Number, required:true},
    location
})

const BookRetailerModel = mongoose.model("BookRetailer", BookRetailer);

module.exports = BookRetailerModel;