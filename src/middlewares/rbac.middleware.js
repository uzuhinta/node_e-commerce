const { UnauthorizedError } = require('#src/core/error.response.js');
const RbacService = require('#src/services/rbac.service.js');
const rbac = require('./role.middleware');

const grantAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      rbac.setGrants(await RbacService.listRole({}));
      const rol_name = req.query.role;
      const permission = rbac.can(rol_name)[action](resource);
      if (!permission.granted) {
        throw new UnauthorizedError();
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = grantAccess;
