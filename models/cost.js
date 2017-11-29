let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let CostSchema = new Schema({
  _id: Number,
  amount: Number,
  createdAt: Date,
  category: String,
  title: String,
  description: String
});

CostSchema.pre('save', function (next) {
  var cost = this;
  console.log('-------------cost------------------');
  console.log(cost);
  bcrypt.hash(user.pass, 10, function (err, hash){
    if (err) {
      return next(err);
    }
    user.pass = hash;
    next();
  })
});

module.exports = mongoose.model('cost', CostSchema);
