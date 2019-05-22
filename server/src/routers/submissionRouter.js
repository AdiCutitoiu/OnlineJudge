const express = require('express');
const submissionController = require('../controllers/submissionController')

const router = express.Router();

router.get('/', async (req, res) => {
    try {
      const submissions = await submissionController.list();
      res.json(submissions);
    } catch (err) {
      console.log(err);
      res.status(500).end();
    }
  });


router.get('/:id', async (req, res) => {
  try {
    const submission = await submissionController.getSubmission(req.params.id);
    if(!submission) {
      return res.status(404).end();
    }

    return res.json(submission);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
})

module.exports = router;