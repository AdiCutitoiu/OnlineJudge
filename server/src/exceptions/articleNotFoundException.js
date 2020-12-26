const NotFoundException 
  = require("./resourceNotFoundException");

class ArticleNotFound extends NotFoundException {
  constructor() {
    super("Article");
  }
}

module.exports = ArticleNotFound;
