const userModel = require('../models/user');
const UserNotFoundException = require('../exceptions/userNotFoundException');
const HttpException = require('../exceptions/httpException');

class UserController {
  async list() {
    return userModel
      .find({ $or: [{ 'role': 'Moderator' }, { 'role': 'Normal' }] })
      .select('-passwordHash')
  }

  async getProfile(userId) {
    const user = await userModel.findOne({ _id: userId }, '-passwordHash');
    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  async changePermissions(userId, role) {
    const user = await userModel.findOne({ _id: userId }, '-passwordHash');
    if (!user) {
      throw new UserNotFoundException();
    }

    if (user.role === 'Admin') {
      throw new HttpException('400', 'Admin\'s role cannot be changed');
    }

    user.role = role;
    await user.save();

    return user;
  }
}

module.exports = new UserController();
