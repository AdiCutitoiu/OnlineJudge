const express = require('express');
const authenticationRouter = require('./authenticationRouter');

const router = express.Router();

router.use('/auth', authenticationRouter);

module.exports = router;
