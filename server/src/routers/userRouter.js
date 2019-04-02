const express = require('express');
const authorize = require('../middleware/authorize');
const userModel = require('../models/user');

const router = express.Router();

router
  .route('/')
  .get(async (req, res) => {
    try {
      await userModel.find({});
    } catch (err) {
      console.log(err);
      res.status(500).end();
    }
  });

module.exports = router;