const { model, Schema } = require('mongoose');

const COLLECTION_NAME = 'Roles';
const DOCUMENT_NAME = 'Role';

const roleSchema = new Schema(
  {
    rol_name: { type: String, default: 'user', enum: ['user', 'shop', 'admin'] },
    rol_slug: { type: String, require: true },
    rol_status: { type: String, default: 'active', enum: ['active', 'block', 'pending'] },
    rol_description: { type: String, default: '' },
    rol_grants: [
      {
        resource: { type: Schema.Types.ObjectId, ref: 'Resource', require: true },
        actions: [{ type: String, require: true }],
        attributes: { type: String, default: '*' },
      },
    ],
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, roleSchema);
