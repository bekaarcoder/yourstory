const express = require('express');
const router = express.Router();

// index route
router.get('/', (req, res) => {
	res.render('index/index', {
		header: "YourStory"
	});
});

// dashboard route
router.get('/dashboard', (req, res) => {
	res.render('index/dashboard', {
		header: "YourStory"
	});
});

module.exports = router;