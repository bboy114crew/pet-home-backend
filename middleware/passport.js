const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
// const mongoose = require('mongoose');
const User = require('../models/User');

module.exports = (passport) => {
	var opts = {};
	opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
	opts.secretOrKey = CONFIG.JWT_ENCRYPTION;

	passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
		let err, user;
		[err, user] = await to(User.findById(jwt_payload.user_id));
		if (err) return done(err, false);
		if (user) {
			return done(null, user);
		} else {
			return done(null, false);
		}
	}));
};
