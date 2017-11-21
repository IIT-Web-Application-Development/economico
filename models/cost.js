let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let CostSchema = new Schema({
	amount: Number,
	date: Date,
    category: String,
    title: String,
    description: String
});

module.exports = mongoose.model('cost', CostSchema);