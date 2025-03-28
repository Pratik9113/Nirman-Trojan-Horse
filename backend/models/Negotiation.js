const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  role: {
    type: String,
    enum: ['customer', 'assistant', 'retailer'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const negotiationSchema = new Schema({
  productId: {
    type: String,
    required: true
  },
  customerId: {
    type: Schema.Types.Mixed,
    required: true
  },
  retailerId: {
    type: String,
    required: true
  },
  initialPrice: {
    type: Number,
    required: true
  },
  minimumPrice: {
    type: Number,
  },
  budget: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  counterOffer: {
    type: Number,
    default: null
  },
  retailerInput: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'accepted', 'rejected', 'counter-offered', 'completed'],
    default: 'active'
  },
  messages: [messageSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Pre-save hook to update the updatedAt field
negotiationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Negotiation = mongoose.model('Negotiation_testing', negotiationSchema);

module.exports = { Negotiation }; 