const express = require('express');
const router = express.Router();
const passport = require('passport');

// google auth route
router.get('/google', passport.authenticate('google', {
	scope: ['profile', 'email']
}));

module.exports = router;