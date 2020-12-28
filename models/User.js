const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "Name is Required!",
  },
  email: {
    type: String,
    required: "Name is Required!",
  },
  password: {
    type: String,
    required: "Password is Required!",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User = mongoose.model("user", UserSchema);
