const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: { type: String },
	lastname: { type: String },
	nickname: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, require: true },
	active: { type: Boolean, default: true },
	games: { type: [{ _id: mongoose.Schema.Types.ObjectId }], ref: 'Games' },
	creatAt: { type: Date, default: Date.now() }
});

userSchema.pre('save', async function (next) {
	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(this.password, salt);
		this.password = hashedPassword;
	} catch (error) {
		next(error);
	}
});

module.exports = mongoose.model('Users', userSchema);
