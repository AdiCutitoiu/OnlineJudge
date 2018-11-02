const express = require('express');
const authenticationRouter = require('./authenticationRouter');
const problemRouter = require('./problemRouter');
const authorize = require('../middleware/authorize');

const router = express.Router();

router.use('/auth', authenticationRouter);
router.use('/problems', authorize.normal, problemRouter);

module.exports = router;
