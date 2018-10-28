const express = require('express');
const problemController = require('../controllers/problemController');

const router = express.Router();

router
  .route('/problems')
  .get(async (req, res) => {
    try {
      res.json(await problemController.listProblems());
    } catch (err) {
      console.err(err);
      res.status(500).end();
    }
  })
  .post(async (req, res) => {
    res.status(201).send({});
  })
  .put(async (req, res) => {
    res.status(200).send({});
  });

router
  .route('/problems/:id')
  .get(async (req, res) => {
    try {
      const problem = problemController.getProblem(req.params.id);

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
  .delete(async (req, res) => {
    try {
      const problem = problemController.getProblem(req.params.id);

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

module.exports = router;