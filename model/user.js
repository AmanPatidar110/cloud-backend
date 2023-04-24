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
    required: false,
  },
  totalSpace: {
    type: Number,
    required: false,
  }

});

const User = mongoose.model("user", userSchema);

module.exports = User;

//firebaseuserid
//name
//email
