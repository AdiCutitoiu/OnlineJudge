const express = require('express');
const problemController = require('../controllers/problemController');
const testController = require('../controllers/testController');
const solutionController = require('../controllers/solutionController');

const router = express.Router();

router
  .route('/')
  .get(async (req, res) => {
    try {
      const problems = await problemController.listProblems();
      res.json(problems);
    } catch (err) {
      console.err(err);
      res.status(500).end();
    }
  })
  .post(async (req, res) => {
    try {
      const problem = await problemController.newProblem(req.body);
      res.status(201).json(problem);
    } catch (err) {
      console.err(err);
      res.status(500).end();
    }
  });

router
  .route('/:id')
  .get(async (req, res) => {
    try {
      const problem = await problemController.getProblem(req.params.id);

      if (problem) {
        res.json(problem);
      } else {
        res.status(404).end();
      }
    } catch (err) {
      console.err(err);
      res.status(500).end();
    }
  })
  .put(async (req, res) => {
    res.status(200).send({});
  })
  .delete(async (req, res) => {
    try {
      const problem = problemController.deleteProblem(req.params.id);

      if (problem) {
        res.status(204).end();
      } else {
        res.status(404).end();
      }
    } catch (err) {
      console.err(err);
      res.status(500).end();
    }
  });

router
  .route('/:id/solutions')
  .post(async (req, res) => {
    try {
      const result = await problemController.addSolution(req.params.id, req.body.code);

      res.json(result);
    } catch (err) {
      console.log(err);
      res.status(500).end();
    }
  });

router
  .route('/:id/tests')
  .get(async (req, res) => {
    try {
      res.json(await testController.list(req.params.id));
    }
    catch (err) {
      res.status(500).end();
      console.err(err);
    }
  })
  .post(async (req, res) => {
    try {
      res.json(await testController.createTest(req.params.id));
    }
    catch (err) {
      res.status(500).end();
      console.err(err);
    }
  });

router
  .route('/:id/tests/:testId')
  .get(async (req, res) => {
    try {
      res.json(await testController.list(req.params.testId));
    }
    catch (err) {
      res.status(500).end();
      console.err(err);
    }
  })
  .post(async (req, res) => {
    try {
      res.json(await testController.createTest(req.params.testId));
    }
    catch (err) {
      res.status(500).end();
      console.err(err);
    }
  })
  .delete(async (req, res) => {
    try {
      res.json(await testController.deleteTest(req.params.testId));
    }
    catch (err) {
      res.status(500).end();
      console.err(err);
    }
  });

module.exports = router;