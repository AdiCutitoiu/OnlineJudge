//@ts-check

const articleModel = require('../models/article');

class ArticleController {
    async list() {
        return articleModel.find({}).select('name');
    }

    async get(id) {
        return  await articleModel.findById(id);
    }

    async create(name, paragraphs) {
        const article = new articleModel({
            name,
            paragraphs
        });

        article.save();

        return article;
    }

    async delete(id) {
        return await articleModel.findByIdAndDelete(id);
    }
}

module.exports = ArticleController;