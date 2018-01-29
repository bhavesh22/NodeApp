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
  phone_number:{
    type: Number,
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

//Static method
UserSchema.statics.user_count = function user_count() {
  User.count(function(err, count){
    console.log(count);
  });
  return 
};

//Instance method
UserSchema.methods.get_user_name = function get_user_name() {
 console.log(this.name);
  return 
};

module.exports = mongoose.model('User', UserSchema);