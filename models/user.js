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
  // username:{
  //   type: String,
  //   required: true
  // },
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



UserSchema.statics.search_by_email = function search_by_email(email) {
  console.log("static method 2");
  return User.findOne({email: email}, function(err, user){
    console.log(user)
    return user;
  });
};

UserSchema.statics.user_count = function user_count() {
  User.count(function(err, count){
    console.log(count);
  });
  return 
};


UserSchema.methods.get_user_name = function get_user_name() {
 console.log(this.name);
  return 
};

const User =  mongoose.model('User', UserSchema);


// User.methods.get_name = function(email, cb) {
//   return this.model('User').where('email', email).name.exec(cb);
// }


// AnimalSchema.methods.findSimilarType = function findSimilarType (cb) {
//   return this.model('Animal').find({ type: this.type }, cb);
// };

// AnimalSchema.statics.search = function search (name, cb) {
//   return this.where('name', new RegExp(name, 'i')).exec(cb);
// }


module.exports = User