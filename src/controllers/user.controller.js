const { OkResponse } = require('#src/core/success.response.js');
const UserService = require('#src/services/user.service.js');

class UserController {
  newUser = async (req, res) => {
    new OkResponse({
      message: 'Upload successfully',
      metadata: await UserService.createUser(req),
    }).send(res);
  };
}

module.exports = new UserController();
