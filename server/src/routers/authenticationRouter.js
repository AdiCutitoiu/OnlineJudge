const express = require('express');
const authenticationController = require('../controllers/authenticationController');
const authorize = require('../middleware/authorize');

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const result = await authenticationController.login(req.body);

        if (!result) {
            return res.status(404).end();
        }

        if (result.error) {
            return res.status(400).json(result);
        }

        res.status(200).json(result);
    } catch (err) {
        res.status(500).send();
    }
});

router.post('/register', async (req, res) => {
    try {
        const result = await authenticationController.register(req.body);

        if (!result) {
            return res.status(404).end();
        }

        if (result.error) {
            return res.status(400).json(result);
        }

        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

router.put('/changePassword', authorize.normal, async (req, res) => {
    try {
        const token = await authenticationController.changePassword(req.body);
        res.status(200).end();
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

module.exports = router;
