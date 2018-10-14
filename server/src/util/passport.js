const passport = require('passport');
const passportJwt = require('passport-jwt');

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: 'secret',
	// issuer: 'accounts.examplesoft.com',
	// audience: 'yoursite.net'
}

passport.use(new JwtStrategy(opts, function (payload, done) {
	User.findOne({ id: payload.sub }, function (err, user) {
		if (err) {
			return done(err, false);
		}
		
		return done(null, user ? user : false);
	});
}));

module.exports = passport;
