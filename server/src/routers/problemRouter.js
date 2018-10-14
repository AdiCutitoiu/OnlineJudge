const express = require('express');

const router = express.Router();

router
  .route('/problems')
  .get(async (req, res) => {
    res.send([]);
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
    res.send({});
  })
  .delete(async (req, res) => {
    res.status(204);
  });

module.exports = router;