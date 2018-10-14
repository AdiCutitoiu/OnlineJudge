const express = require('express');
const authenticationRouter = require('./authenticationRouter');
const problemRouter = require('./problemRouter');
const passport = require('../util/passport');

const router = express.Router();

router.use('/auth', authenticationRouter);
router.use('/user', passport.authenticate('jwt'), problemRouter);

module.exports = router;
