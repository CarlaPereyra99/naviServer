const express = require('express');
const bcrypt = require('bcrypt');
const app = express();

const User = require('../models/User');

// Path to get all Users
app.get('/', (req, res) => {
	User.find({}).exec((err, UserDB) => {
		if (err) {
			return res.status(400).json({
				ok: false,
				err
			});
		}

		return res.json({
			ok: UserDB ? true : false,
			UserDB
		});
	});
});

// Path to find a especif user
app.get('/:id', (req, res) => {
	User.findById(req.params.id).exec((err, UserDB) => {
		if (err) {
			return res.status(400).json({
				ok: false,
				err
			});
		}

		return res.json({
			ok: true,
			UserDB
		});
	});
});

// Path to register a new Users
app.post('/', (req, res) => {
	let body = req.body;

	try {
		const user = new User({
			name: body.name,
			lastname: body.lastname,
			nickname: body.nickname,
			email: body.email,
			password: body.password
		});

		user.save((err, userDB) => {
			if (err) {
				res.status(400).json({
					ok: false,
					err
				});
			}

			return res.json({
				ok: true,
				userDB
			});
		});
	} catch (err) {
		return res.status(400).json({
			ok: false,
			err
		});
	}
});

// Path to login Users
app.post('/login', (req, res) => {
	if ((!req.body.email || !req.body.nickname) && !req.body.password) {
		return res.status(500).json({
			ok: false,
			msg: 'No existe un email o contraseña'
		});
	}

	User.findOne({
		$or: [{ email: req.body.email }, { nickname: req.body.nickname }]
	}).exec(async (err, userDB) => {
		if (err) {
			return res.status(400).json({
				ok: false,
				err
			});
		}

		if (!userDB) {
			return res.status(404).json({
				ok: false,
				msg: 'Ingrese un email o nickname valido'
			});
		}

		const validPass = await bcrypt.compare(req.body.password, userDB.password);

		if (validPass) {
			return res.json({
				ok: true,
				userDB
			});
		} else {
			return res.status(404).json({
				ok: false,
				mgs: 'Contraseña incorrecta'
			});
		}
	});
});

//Path to update user's info
app.put('/:id', async (req, res) => {
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(req.body.password, salt);
	User.findByIdAndUpdate(
		req.params.id,
		{
			name: req.body.name,
			lastname: req.body.lastname,
			nickname: req.body.nickname,
			email: req.body.email,
			password: hashedPassword
		},
		(err, userDB) => {
			if (err) {
				return res.status(400).json({
					ok: false,
					err
				});
			}

			return res.json({
				ok: true,
				userDB
			});
		}
	);
});

// Path to deactivate an user
app.delete('/', (req, res) => {
	User.findByIdAndUpdate(req.body.id, { active: false }, (err, userDB) => {
		if (err) {
			return res.status(400).json({
				ok: false,
				err
			});
		}

		return res.json({
			ok: true,
			userDB
		});
	});
});

module.exports = app;
