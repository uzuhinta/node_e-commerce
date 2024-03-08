const NOTIFICATION_TYPE = require('#src/constants/notiType.constant.js');
const notificationModel = require('#src/models/notification.model.js');

class NotificationService {
  static async pushNotificationToSystem({
    type = NOTIFICATION_TYPE.SHOP_001,
    receiveId = 1,
    senderId = 1,
    options = {},
  }) {
    let noti_content;
    if (type === NOTIFICATION_TYPE.SHOP_001) {
      noti_content = `@@@ has just add a product: @@@@`;
    } else if (type === NOTIFICATION_TYPE.PROMOTION_001) {
      noti_content = '@@@ has just add a voucher: @@@@';
    }

    const newNoti = await notificationModel.create({
      noti_type: type,
      noti_content,
      noti_senderId: senderId,
      noti_receiveId: receiveId,
      noti_options: options,
    });

    return newNoti;
  }

  // eslint-disable-next-line no-unused-vars
  static async listNotificationByUser({ userId = 1, type = 'ALL', isRead = 0 }) {
    const match = { noti_receiveId: userId };
    if (type !== 'ALL') {
      match['noti_type'] = type;
    }

    return await notificationModel.aggregate([
      {
        $match: match,
      },
      {
        $project: {
          noti_type: 1,
          noti_senderId: 1,
          noti_receiveId: 1,
          noti_content: 1,
          noti_options: 1,
          createdAt: 1,
        },
      },
    ]);
  }
}

module.exports = NotificationService;
