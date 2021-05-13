const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
	name: { type: String },
	genre: { type: String },
	image: { type: String },
	website: { type: String },
	creatAt: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('Games', gameSchema);
