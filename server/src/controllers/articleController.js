//@ts-check

const articleModel = require('../models/article');

class ArticleController {
  async list() {
    return articleModel.find({}).select('title');
  }

  async get(id) {
    return await articleModel.findById(id);
  }

  async create(articleData) {

    const article = new articleModel(articleData);

    await article.save();

    return article;
  }

  async delete(id) {
    return await articleModel.findByIdAndDelete(id);
  }
}

module.exports = ArticleController;