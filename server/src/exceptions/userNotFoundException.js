const NotFoundException 
  = require("./resourceNotFoundException");

class UserNotFoundException extends NotFoundException {
  constructor() {
    super("User");
  }
}

module.exports = UserNotFoundException;
