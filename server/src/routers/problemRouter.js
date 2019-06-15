const express = require('express');
const problemController = require('../controllers/problemController');
const authorize = require('../middleware/authorize');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const problems = await problemController.listProblems();
    res.json(problems);
  } catch (err) {
    next(err);
  }
})
router.post('/', authorize.moderator, async (req, res, next) => {
  try {
    const problem = await problemController.create(req.body);
    res.status(201).json(problem);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const problem = await problemController.getProblem(req.params.id);

    if (problem) {
      res.json(problem);
    } else {
      res.status(404).end();
    }
  } catch (err) {
    next(err);
  }
})

router.post('/:id/solutions/cpp', async (req, res, next) => {
  try {
    const result = await problemController.addSolution(req.user.id, req.params.id, req.body.code);

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/solutions/javascript', async (req, res, next) => {
  try {
    const result = await problemController.addJsSolution(req.user.id, req.params.id, req.body.code);

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;