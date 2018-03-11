const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

// load User model
require('./models/User');

// Configure passport
require('./config/passport')(passport);

// load routes
const index = require('./routes/index');
const auth = require('./routes/auth');
const stories = require('./routes/stories');

// load google auth keys
const keys = require('./config/keys');

// load helpers
const { truncate, stripTags, formatDate, optionSelected } = require('./helpers/hbs');

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

// template engine
app.engine('.hbs', exphbs({
	helpers: {
		truncate: truncate,
		stripTags: stripTags,
		formatDate: formatDate,
		optionSelected: optionSelected
	},
	defaultLayout: 'main',
	extname: '.hbs'
}));
app.set('view engine', '.hbs');

// express-validator middleware
app.use(expressValidator());

// to access static folder
app.use(express.static(path.join(__dirname, 'public')));

// coockie parser & express-session middleware
app.use(cookieParser());
app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: false
}));

// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// connect-flash middleware
app.use(flash());

// set local variables
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.user = req.user || null;
	next();
});

// use routes
app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);

app.listen(port, () => {
	console.log(`Service started on port ${port}`);
});