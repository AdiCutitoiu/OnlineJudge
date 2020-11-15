module.exports = {
  normal: (req, res, next) => {
    if (!req.user) {
      return res.status(401).end();
    }

    next();
  },
  moderator: (req, res, next) => {
    if (!req.user) {
      return res.status(401).end();
    }

    if (req.user.isModerator() || req.user.isAdmin()) {
      return next();
    }

    return res.status(401).end();
  },
  admin: (req, res, next) => {
    if (!req.user || !req.user.isAdmin()) {
      return res.status(401).end();
    }

    next();
  },
};
