const HttpException = require('./httpException');

class ResourceNotFoundException extends HttpException {
  constructor(resourceType) {
    super(404, `${resourceType} not found`);
  }
}

module.exports = ResourceNotFoundException;
