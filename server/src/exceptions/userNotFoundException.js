const ResourceNotFoundException = require("./resourceNotFoundException");

class UserNotFoundException extends ResourceNotFoundException {
  constructor(resourceType) {
    super("User");
  }
}

module.exports = UserNotFoundException;
