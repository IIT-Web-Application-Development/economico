let mongoose = require('mongoose');
let Cost = require('./cost');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
	_id:   String,
	name:  String,
	pass:  String,
	limit: Number,
	email: String,
	costs: [Cost.schema]
});

module.exports = mongoose.model('user', UserSchema);