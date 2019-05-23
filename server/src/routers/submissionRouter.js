const express = require('express');
const submissionController = require('../controllers/submissionController')

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
      const submissions = await submissionController.list();
      res.json(submissions);
    } catch (err) {
      next(err);
    }
  });


router.get('/:id', async (req, res, next) => {
  try {
    const submission = await submissionController.getSubmission(req.params.id);
    if(!submission) {
      return res.status(404).end();
    }

    return res.json(submission);
  } catch (err) {
    next(err);
  }
})

module.exports = router;