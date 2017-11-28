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

module.exports = mongoose.model('cost', CostSchema);
