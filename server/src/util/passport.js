const passport = require('passport');
const passportJwt = require('passport-jwt');
const userModel = require('../models/user');
const config = require('../../config');

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: config.secret,
}

passport.use(new JwtStrategy(opts, async function (payload, done) {
	try {
		const user = await userModel.findById(payload.id);

		if (!user) {
			return done(null, false);
		}

		return done(null, user);
	} catch (err) {
		console.log(err);
		return done(err, false);
	}
}));

module.exports = passport;
