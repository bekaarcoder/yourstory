const express = require('express');
const router = express.Router();
const passport = require('passport');

// google auth route
router.get('/google', passport.authenticate('google', {
	scope: ['profile', 'email']
}));

// google auth callback
router.get('/google/callback', passport.authenticate('google', {
 failureRedirect: '/' 
}), (req, res) => {
	res.redirect('/dashboard');
});

module.exports = router;