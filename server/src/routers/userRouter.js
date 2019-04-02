const express = require('express');
const authorize = require('../middleware/authorize');
const userModel = require('../models/user');

const router = express.Router();

router
  .route('/')
  .get(async (req, res) => {
    try {
      const users = await userModel.find({});
      res.json(users);
    } catch (err) {
      console.log(err);
      res.status(500).end();
    }
  });

router.put('/:id/promote', async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).end();
    }

    if (user.role === 'Admin') {
      return res.status(401).end();
    }

    user.role = 'Moderator';
    await user.save();

    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
})

router.put('/:id/demote', async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).end();
    }

    if (user.role === 'Admin') {
      return res.status(401).end();
    }

    user.role = 'Normal';
    await user.save();

    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
})

module.exports = router;