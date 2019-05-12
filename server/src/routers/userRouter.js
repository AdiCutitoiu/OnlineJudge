const express = require('express');
const authorize = require('../middleware/authorize');
const userModel = require('../models/user');

const router = express.Router();

router
  .route('/')
  .get(async (req, res) => {
    try {
      const users = await userModel.find({ $or: [{ 'role': 'Moderator' }, { 'role': 'Normal' }] }).select('-passwordHash');
      res.json(users);
    } catch (err) {
      console.log(err);
      res.status(500).end();
    }
  });

router.get('/profile', authorize.normal, async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.user.id }, '-passwordHash');
    if(!user) {
      res.status(404).end();
    }

    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
});

router.put('/:id/promote', authorize.admin, async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.params.id }, '-passwordHash');
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

router.put('/:id/demote', authorize.admin, async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.params.id }, '-passwordHash');
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