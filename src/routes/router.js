const express = require('express');
const app = express();

app.use('/user', require('./Users'));
app.use('/game', require('./Games'));

module.exports = app;
