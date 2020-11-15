const ArticleNotFoundException = require("../exceptions/articleNotFoundException");
const articleModel = require("../models/article");

class ArticleController {
  async list() {
    return articleModel.find({}).select("title");
  }

  async get(id) {
    const article = await articleModel.findById(id);

    if (!article) {
      throw new ArticleNotFoundException();
    }

    return article;
  }

  async create(articleData) {
    const article = new articleModel(articleData);

    await article.save();

    return article;
  }
}

module.exports = new ArticleController();
