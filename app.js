const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const app = express();
const port = process.env.PORT || 5000;

// Configure passport
require('./config/passport')(passport);

// load routes
const auth = require('./routes/auth');

app.get('/', (req, res) => {
	res.send('It worked');
});

// use routes
app.use('/auth', auth);

app.listen(port, () => {
	console.log(`Service started on port ${port}`);
});