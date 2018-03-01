const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

// load User model
require('./models/User');

// Configure passport
require('./config/passport')(passport);

// load routes
const auth = require('./routes/auth');

// load google auth keys
const keys = require('./config/keys');

// map global promises
mongoose.Promise = global.Promise;

// mongoose connect
mongoose.connect(keys.mongoURI).then(() => {
	console.log('MongoDB connected');
}).catch((err) => {
	console.log(err);
});

const app = express();
const port = process.env.PORT || 5000;

// coockie parser & express-session middleware
app.use(cookieParser());
app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: false
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// set local variables
app.use((req, res, next) => {
	res.locals.user = req.user || null;
	next();
});

app.get('/', (req, res) => {
	res.send('It worked');
});

// use routes
app.use('/auth', auth);

app.listen(port, () => {
	console.log(`Service started on port ${port}`);
});