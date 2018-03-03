const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');

// stories route
router.get('/', (req, res) => {
	res.render('stories/index', {
		header: "Stories"
	});
});

// add story route
router.get('/add', (req, res) => {
	res.render('stories/add', {
		header: "Add Story"
	});
});

module.exports = router;