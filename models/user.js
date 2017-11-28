let mongoose = require('mongoose');
let Cost = require('./cost');
let Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

let UserSchema = new Schema({
	_id:   String,
	name:  String,
	pass:  String,
	limit: Number,
	email: String,
	costs: [Cost.schema]
});

UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.pass, 10, function (err, hash){
    if (err) {
      return next(err);
    }
    user.pass = hash;
    next();
  })
});


//authenticate input against database
UserSchema.statics.authenticate = function (username, password, callback) {
  User.findOne({ _id: username})
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }else{
      	bcrypt.compare(password, user.pass, function (err, result) {
	        if (result === true) {
	          return callback(null, user);
	        } else {
	          return callback();
	        }
        })
      }
      
    });




}



var User = mongoose.model('user',UserSchema);

module.exports = User;
