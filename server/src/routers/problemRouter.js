const express = require('express');
const problemController = require('../controllers/problemController');

const router = express.Router();

router
  .route('/')
  .get(async (req, res, next) => {
    try {
      const problems = await problemController.listProblems();
      res.json(problems);
    } catch (err) {
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      const problem = await problemController.create(req.body);
      res.status(201).json(problem);
    } catch (err) {
      next(err);
    }
  });

router
  .route('/:id')
  .get(async (req, res, next) => {
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
  .delete(async (req, res, next) => {
    try {
      const problem = problemController.deleteProblem(req.params.id);

      if (problem) {
        res.status(204).end();
      } else {
        res.status(404).end();
      }
    } catch (err) {
      next(err);
    }
  });

router
  .route('/:id/solutions/cpp')
  .post(async (req, res, next) => {
    try {
      const result = await problemController.addSolution(req.user.id, req.params.id, req.body.code);

      res.json(result);
    } catch (err) {
      next(err);
    }
  });

router
  .route('/:id/solutions/javascript')
  .post(async (req, res, next) => {
    try {
      const result = await problemController.addJsSolution(req.user.id, req.params.id, req.body.code);

      res.json(result);
    } catch (err) {
      next(err);
    }
  });

module.exports = router;