/* eslint-disable no-unused-vars */
const { ConflictError } = require('#src/core/error.response.js');
const resourceModel = require('#src/models/resource.model.js');
const roleModel = require('#src/models/role.model.js');

class RbacService {
  static async createResource({ name = 'profile', slug = 'p00001', description }) {
    const storedResource = await resourceModel.findOne({ src_slug: slug });

    if (storedResource) {
      throw new ConflictError();
    }

    const resource = await resourceModel.create({
      src_name: name,
      src_slug: slug,
      src_description: description,
    });

    return resource;
  }

  static async listResource({ userId, limit = 30, offset = 0, search = '' }) {
    const resources = await resourceModel.aggregate([
      {
        $project: {
          _id: 0,
          name: '$src_name',
          slug: '$src_slug',
          description: '$src_description',
          resourceId: '$_id',
          createdAt: 1,
        },
      },
    ]);
    return resources;
  }

  static async createRole({ name = 'shop', slug = 's00001', description = 'extend from shop or user', grants = [] }) {
    const storedRole = await roleModel.findOne({ rol_slug: slug });

    if (storedRole) {
      throw new ConflictError();
    }

    const role = await roleModel.create({
      rol_name: name,
      rol_slug: slug,
      rol_description: description,
      rol_grants: grants,
    });

    return role;
  }

  static async listRole({ userId = 1, limit = 30, offset = 0, search = '' }) {
    const roles = await roleModel.aggregate([
      {
        $unwind: '$rol_grants',
      },
      {
        $lookup: {
          from: 'Resources',
          localField: 'rol_grants.resource',
          foreignField: '_id',
          as: 'resource',
        },
      },
      {
        $unwind: '$resource',
      },
      {
        $project: {
          role: '$rol_name',
          resource: '$resource.src_name',
          action: '$rol_grants.actions',
          attributes: '$rol_grants.attributes',
        },
      },
      {
        $unwind: '$action',
      },
      {
        $project: {
          _id: 0,
          role: 1,
          resource: 1,
          action: '$action',
          attributes: 1,
        },
      },
    ]);

    return roles;
  }
}

module.exports = RbacService;
