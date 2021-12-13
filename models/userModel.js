const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    fullName: { type: String, required: true },
    experience: { type: String },
    competence: { type: String },
    education: { type: String },
    location: { type: String },
    picture: { type: String },
    passwordHash: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("user", userSchema);

module.exports = User;
