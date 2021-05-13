const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 4000;

// Database Conection Successful
mongoose
	.connect('mongodb+srv://NaerHdz:NaerMongo_28@cluster0.vdnph.mongodb.net/navi', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true
	})
	.then((db) => console.log('Database Online'))
	.catch((err) => console.log('[Err]', err));

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api', require('./src/routes/router'));

app.listen(port, () => {
	console.log(`Sever Online on port: ${port}`);
});
