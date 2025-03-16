const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  phone_number: { type: String, required: true },
  profilePic: {
    type: String,
    required: false,
  },
  post: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: false,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Remove any existing indexes before creating new ones
UserSchema.index({ email: 1 }, { unique: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);
module.exports = User;
