const express = require('express');
const authenticationController = require('../controllers/authenticationController');
const authorize = require('../middleware/authorize');

const router = express.Router();

router.post('/login', async (req, res, next) => {
  try {
    const result = await authenticationController.login(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    const result = await authenticationController.register(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
