const mongoose = require("mongoose")
const deliverySchema = new mongoose.Schema({
    retailerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller" },
    location: { type: { type: String, default: "Point" }, coordinates: [Number] }, // [longitude, latitude]
    orderTime: { type: Date, default: Date.now },
    status: { type: String, enum: ["pending", "assigned", "delivered"], default: "pending" }
})
const deliverySchemaModel = mongoose.model("Delivery", deliverySchema);
module.exports = deliverySchemaModel;