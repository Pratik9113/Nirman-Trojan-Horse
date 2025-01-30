const mongoose = require("mongoose");
const RewardSchema = new mongoose.Schema(
  {
    customer_name: {
      type: String,
      required: true,
    },
    customer_email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    total_monthly_revenue: {
      type: Number,
    },
    raw_material_supplier:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "RawMaterialSupplier",
    },
    reward_tier: {
      type: String,
    //   required: true,
    },
    reward: {
      type: String,
    //   required: true,
    },
    reward_valid: {
      type: String,
    //   required: true,
    },
    total_monthly_revenue: {
      type: Number,
    },
    total_loyalty_points: {
      type: Number,
    },
    cashback_amount: {
      type: Number,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reward", RewardSchema);