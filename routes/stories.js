const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

// load story and user model
require('../models/Story');
require('../models/User');
const Story = mongoose.model('stories');
const User = mongoose.model('users');

// stories route
router.get('/', (req, res) => {
	Story.find({
		status: 'public'
	}).populate('user').then((stories) => {
		res.render('stories/index', {
			header: "Stories",
			stories: stories
		});
	});
});

// add story route
router.get('/add', ensureAuthenticated, (req, res) => {
	res.render('stories/add', {
		header: "Add Story"
	});
});

// posting stories
router.post('/', ensureAuthenticated, (req, res) => {
	let data = JSON.parse(JSON.stringify(req.body));
	let allowComments;
	if(data.hasOwnProperty('allowComments')) {
		allowComments = true;
	} else {
		allowComments = false;
	}

	let title = req.body.title;
	let body = req.body.body;

	// validation
	req.checkBody('title', 'Please enter a title for the story.').notEmpty();
	req.checkBody('body', 'You need to write something for sharing your story.').notEmpty();

	let errors = req.validationErrors();
	if(errors) {
		req.flash('error_msg', errors[0].msg);
		res.redirect('stories/add');
	} else {
		const newStory = {
			title: req.body.title,
			body: req.body.body,
			status: req.body.status,
			allowComments: allowComments,
			user: req.user.id
		};

		// save story
		new Story(newStory).save().then((story) => {
			res.redirect(`/stories/show/${story.id}`);
		});
	}
});

module.exports = router;