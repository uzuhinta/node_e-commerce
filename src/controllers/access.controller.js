const { CreatedResponse, OkResponse } = require('#src/core/success.response.js');
const AccessService = require('#src/services/access.service.js');

class AccessController {
  login = async (req, res) => {
    new OkResponse({
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  logout = async (req, res) => {
    new OkResponse({
      message: 'Logout successfully',
      metadata: await AccessService.logout(req),
    }).send(res);
  };

  handleRefreshToken = async (req, res) => {
    new OkResponse({
      message: 'Get token success',
      metadata: await AccessService.handleRefreshToken(req.body),
    }).send(res);
  };

  signup = async (req, res) => {
    new CreatedResponse({
      message: 'Shop created successfully!',
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };
}

module.exports = new AccessController();
