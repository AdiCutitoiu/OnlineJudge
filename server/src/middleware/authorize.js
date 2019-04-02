const passport = require('../util/passport');

module.exports = {
  normal: (req, res, next) => {
    if(!req.user) {
      return res.status(401).end();
    }

    next();
  },
  moderator: (req, res, next) => {
    if(!req.user || !req.user.isModerator() || !req.user.isAdminUser()) {
      return res.status(401).end();
    }

    next();
  },
  admin: (req, res, next) => {
    if(!req.user || !req.user.isAdmin()) {
      return res.status(401).end();
    }

    next();
  }
};