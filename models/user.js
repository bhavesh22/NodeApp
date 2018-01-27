const mongoose = require('mongoose');

// User Schema
const UserSchema = mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  username:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  activation_key: {
    type: String,
  },
  active: {
    type: Boolean
  }
});

const User = module.exports = mongoose.model('User', UserSchema);
