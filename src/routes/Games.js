const express = require('express');
const { Schema } = require('mongoose');
const Game = require('../models/Game');

const app = express();

// path to get all games or an especific game
app.get('/:id?', (req, res) => {
	let search = {};
	if (req.params.id) {
		search = { _id: req.params.id };
	}

	Game.find(search).exec((err, gameDB) => {
		if (err) {
			return res.status(400).json({
				ok: false,
				err
			});
		}

		return res.json({
			ok: true,
			gameDB
		});
	});
});

// Path to create a game
app.post('/', (req, res) => {
	const game = new Game({
		name: req.body.name,
		genre: req.body.genre,
		image: req.body.image,
		website: req.body.website
	});

	game.save(async (err, gameDB) => {
		if (err) {
			return res.status(400).json({
				ok: true,
				err
			});
		}

		const User = require('../models/User');
		const user = await User.findById(req.body.id);

		user.games.push({ _id: gameDB._id });

		await User.updateMany(
			{ _id: user._id },
			{
				$set: {
					games: user.games
				}
			}
		);

		return res.json({
			ok: true,
			gameDB
		});
	});
});

// Path to edit a especif game
app.put('/', (req, res) => {
	Game.findByIdAndUpdate(
		req.body.id,
		{
			name: req.body.name,
			genre: req.body.genre,
			image: req.body.image,
			website: req.body.website
		},
		(err, gameDB) => {
			if (err) {
				return res.status(400).json({
					ok: false,
					err
				});
			}

			return res.json({
				ok: true,
				gameDB
			});
		}
	);
});

// Path to delete a game
app.delete('/', async (req, res) => {
	const User = require('../models/User');
	const user = await User.findById(req.body.idUsr);

	const index = user.games.findIndex((game) => game._id == req.body.idGame);

	if (index != -1) user.games.pop(index);

	await User.updateMany(
		{ _id: user._id },
		{
			$set: {
				games: user.games
			}
		}
	);

	Game.findByIdAndRemove(req.body.idGame, (err, gameDB) => {
		if (err) {
			return res.status(400).json({
				ok: false,
				err
			});
		}

		return res.json({
			ok: true,
			gameDB
		});
	});
});

module.exports = app;
