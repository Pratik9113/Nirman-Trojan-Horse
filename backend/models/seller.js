
const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  item: [{
    name: { type: String, required: true },
  }],
  createdAt: { type: Date, default: Date.now },
});

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;