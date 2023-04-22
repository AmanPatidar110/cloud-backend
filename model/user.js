const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
  },
  firebaseUserId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  usedSpace: {
    type: Number,
    required: true,
  },
  totalSpace: {
    type: Number,
    required: true,
  }

});

const User = mongoose.model("user", userSchema);

module.exports = User;

//firebaseuserid
//name
//email
