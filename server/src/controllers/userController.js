const userModel = require('../models/user');
const config = require('../../config');

class UserController {
  async createAdminIfNotExists() {
    try {
      let admin = await userModel.find({ email: config.adminCredentials.email });
      if(!admin) {
        admin = await userModel.create({
            email: config.adminCredentials.password,
            passwordHash: sha256(config.adminCredentials.password)
        });

        if(!admin) {
          return false;
        }
      }
      return true;
    } catch(err) {
      console.err(err);
      return false;
    }
  }
}

module.exports = new UserController();