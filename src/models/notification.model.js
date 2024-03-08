const NOTIFICATION_TYPE = require('#src/constants/notiType.constant.js');
const { model, Schema, Types } = require('mongoose');

const COLLECTION_NAME = 'Notifications';
const DOCUMENT_NAME = 'Notification';

const notificationSchema = new Schema(
  {
    noti_type: {
      type: String,
      enum: Object.values(NOTIFICATION_TYPE),
      require: true,
    },
    noti_senderId: {
      type: Types.ObjectId,
      require: true,
      ref: 'Shop',
    },
    noti_receiveId: {
      type: Number,
      require: true,
    },
    noti_content: {
      type: String,
      require: true,
    },
    noti_options: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, notificationSchema);
