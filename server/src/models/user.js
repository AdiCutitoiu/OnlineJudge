const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["Admin", "Moderator", "Normal"],
    default: "Normal",
  },
});

userSchema.methods.isAdmin = function (role) {
  return this.role === "Admin";
};

userSchema.methods.isModerator = function (role) {
  return this.role === "Moderator";
};

userSchema.methods.isNormalUser = function (role) {
  return this.role === "Normal";
};

module.exports = mongoose.model("User", userSchema);
