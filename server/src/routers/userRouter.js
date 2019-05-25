const express = require('express');
const authorize = require('../middleware/authorize');
const userController = require('../controllers/userController')

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
      res.json(await userController.list());
    } catch (err) {
      next(err);
    }
  });

router.get('/profile', async (req, res, next) => {
  try {
    res.json(await userController.getProfile(req.user.id));
  } catch (error) {
    next(err);
  }
});

router.put('/:id/promote', authorize.admin, async (req, res, next) => {
  try {
    res.json(await userController.changePermissions(req.params.id, 'Moderator'));
  } catch (err) {
    next(err);
  }
})

router.put('/:id/demote', authorize.admin, async (req, res, next) => {
  try {
    res.json(await userController.changePermissions(req.params.id, 'Normal'));
  } catch (err) {
    next(err);
  }
})

module.exports = router;