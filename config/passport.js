const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');

// load User model
const User = mongoose.model('users');

module.exports = function(passport) {
	passport.use(new GoogleStrategy({
		clientID: keys.googleClientId,
		clientSecret: keys.googleClientSecret,
		callbackURL: '/auth/google/callback',
		proxy: true
	}, (accessToken, refreshToken, profile, done) => {
		/*console.log(accessToken);
		console.log(profile);*/
		const imageUrl = profile.photos[0].value.split("?");
		const image = imageUrl[0];

		const newUser = {
			googleID: profile.id,
			email: profile.emails[0].value,
			displayName: profile.displayName,
			firstName: profile.name.givenName,
			lastName: profile.name.familyName,
			profileImg: image
		};

		// check if user exist
		User.findOne({
			googleID: profile.id
		}).then((user) => {
			if(user) {
				done(null, user);
			} else {
				// create user
				new User(newUser).save().then((user) => {
					done(null, user);
				});
			}
		});
	}));

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		User.findById(id).then((user) => {
			done(null, user);
		});
	})
};