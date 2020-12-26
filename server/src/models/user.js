const mongoose = require("mongoose");

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

userSchema.methods.isAdmin = function () {
  return this.role === "Admin";
};

userSchema.methods.isModerator = function () {
  return this.role === "Moderator";
};

userSchema.methods.isNormalUser = function () {
  return this.role === "Normal";
};

module.exports = mongoose.model("User", userSchema);
