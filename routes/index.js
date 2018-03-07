const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

// load story model
require('../models/Story');
const Story = mongoose.model('stories');

// index route
router.get('/', (req, res) => {
	res.render('index/index', {
		header: "YourStory"
	});
});

// dashboard route
router.get('/dashboard', ensureAuthenticated, (req, res) => {
	Story.find({
		user: req.user.id
	}).then((stories) => {
			res.render('index/dashboard', {
			header: "YourStory",
			stories: stories
		});
	});
});

module.exports = router;