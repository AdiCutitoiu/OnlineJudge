const ResourceNotFoundException = require('./resourceNotFoundException');

class ArticleNotFoundException extends ResourceNotFoundException {
  constructor(resourceType) {
    super('Article');
  }
}

module.exports = ArticleNotFoundException;
