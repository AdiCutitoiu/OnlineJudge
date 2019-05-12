const express = require('express');
const ArticleController = require('../controllers/articleController');

const controller = new ArticleController();

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        res.json(await controller.list());
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        res.status(201).json(await controller.create(req.body));
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        res.json(await controller.get(req.params.id));
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async(req, res, next) => {
    try {
        const article = await controller.delete(req.params.id);
        
        if(!article) {
            return res.status(404).end();
        }
        
        res.status(204).end();
    } catch (error) {
        next(error);
    }
})

module.exports = router;
