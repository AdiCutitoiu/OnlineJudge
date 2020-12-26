const userModel = require("../models/user");
const UserNotFoundException 
  = require("../exceptions/userNotFoundException");
const HttpException 
  = require("../exceptions/httpException");

const CHANGE_PERM_ERR = "Admin's role cannot be changed";

class UserController {
  async list() {
    return userModel
      .find({ 
        $or: [
          { role: "Moderator" }, 
          { role: "Normal" },
        ],
      })
      .select("-passwordHash");
  }

  async getProfile(userId) {
    const user = await userModel.findOne(
      { _id: userId }, 
      "-passwordHash",
    );

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  async changePerms(userId, role) {
    const user = await userModel.findOne(
      { _id: userId }, 
      "-passwordHash",
    );

    if (!user) {
      throw new UserNotFoundException();
    }

    if (user.role === "Admin") {
      throw new HttpException("400", CHANGE_PERM_ERR);
    }

    user.role = role;
    await user.save();

    return user;
  }
}

module.exports = new UserController();
