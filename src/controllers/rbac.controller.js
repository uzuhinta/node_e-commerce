const { CreatedResponse, OkResponse } = require('#src/core/success.response.js');
const RbacService = require('#src/services/rbac.service.js');

class RbacController {
  newRole = async (req, res) => {
    new CreatedResponse({
      message: 'Create Role',
      metadata: await RbacService.createRole(req.body),
    }).send(res);
  };

  newResource = async (req, res) => {
    new CreatedResponse({
      message: 'Create Role',
      metadata: await RbacService.createResource(req.body),
    }).send(res);
  };

  listRole = async (req, res) => {
    new OkResponse({
      message: 'List Role',
      metadata: await RbacService.listRole(req.query),
    }).send(res);
  };

  listResource = async (req, res) => {
    new OkResponse({
      message: 'List Role',
      metadata: await RbacService.listResource(req.query),
    }).send(res);
  };
}

module.exports = new RbacController();
