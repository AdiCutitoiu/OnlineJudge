const passport = require('../util/passport');

const authenticate = passport.authenticate('jwt', { session: false });

function roleAuthenticator(roleChecker) {
  return async (req, res, next) => {

    authenticate(req, res, next);

    if (!req.user || !roleChecker(req.user)) {
      return res.status(401).end();
    }

    return next();
  };
}

module.exports = {
  normal: roleAuthenticator(user => {
    return user.isNormalUser() || user.isModerator() || user.isAdmin();
  }),
  moderator: roleAuthenticator(user => {
    return user.isModerator() || user.isAdmin();
  }),
  admin: roleAuthenticator(user => {
    return user.isAdmin();
  }),
};