const { OkResponse } = require('#src/core/success.response.js');
const NotificationService = require('#src/services/notification.service.js');

class NotificationController {
  listNotificationByUser = async (req, res) => {
    new OkResponse({
      message: 'List user successfully',
      metadata: await NotificationService.listNotificationByUser(req.query),
    }).send(res);
  };
}

module.exports = new NotificationController();
