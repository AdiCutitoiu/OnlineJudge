const express = require('express');
const authenticationRouter = require('./authenticationRouter');
const problemRouter = require('./problemRouter');
const userRouter = require('./userRouter');
const articleRouter = require('./articleRouter');
const authorize = require('../middleware/authorize');
const passport = require('passport');

const router = express.Router();

router.use('/auth', authenticationRouter);
router.use('/users', passport.authenticate('jwt', { session: false }), authorize.normal, userRouter);
router.use('/problems', passport.authenticate('jwt', { session: false }), authorize.normal, problemRouter);
router.use('/articles', passport.authenticate('jwt', { session: false }), authorize.normal, articleRouter);

module.exports = router;
