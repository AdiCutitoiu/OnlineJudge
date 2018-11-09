const express = require('express');
const authenticationController = require('../controllers/authenticationController');
const authorize = require('../middleware/authorize');

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const token = await authenticationController.login(req.body);
        res.status(200).json(token);
    } catch (err) {
        res.status(500).send();
    }
});

router.post('/register', async (req, res) => {
    try {
        const token = await authenticationController.register(req.body);
        res.status(201).json(token);
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
