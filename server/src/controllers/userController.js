const config = require('../../config');

class UserController {
  constructor(userModel) {
    this._userModel = userModel;
  }

  async createAdminIfNotExists() {
    try {
      let admin = await this._userModel.find({ email: config.adminCredentials.email });
      if(!admin) {
        admin = await this._userModel.create({
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