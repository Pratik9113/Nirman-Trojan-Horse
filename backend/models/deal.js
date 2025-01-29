const mongoose = require("mongoose");
const DealSchema = new mongoose.Schema({
    dealer: { type: mongoose.Schema.Types.ObjectId, ref: "RawMaterialSeller", required: true },
    agreed_price: { type: Number, required: true },
    product : {type:String, required:true},
    timestamp: { type: Date, required: true },
});
module.exports = mongoose.models.Deal ||  mongoose.model("Deal", DealSchema);

const CustomerDealSchema = new mongoose.Schema({
    customer : { type: mongoose.Schema.Types.ObjectId, ref: "RawMaterialSeller", required: true },
    agreed_price: { type: Number, required: true },
    product : {type:String, required:true},
    timestamp: { type: Date, required: true },
});
module.exports = mongoose.models.Deal ||  mongoose.model("CustomerDeal", CustomerDealSchema);
