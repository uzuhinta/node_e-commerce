const { ConflictError } = require('#src/core/error.response.js');
const Email = require('#src/helpers/nodemailer.js');
const userModel = require('#src/models/user.model.js');
const { replacePlaceholder } = require('#src/utils/index.js');
const HTML_TEMPLATE = require('#src/constants/htmlTemplate.constant.js');
const OtpService = require('./otp.service');

class UserService {
  static createUser = async (req) => {
    const { email } = req.body;
    const storedUser = await userModel.findOne({ usr_email: email }).lean();

    if (storedUser) {
      throw new ConflictError('Email already exist');
    }

    const otp = await OtpService.newOtp({ email });

    console.log(
      'faf',
      replacePlaceholder({
        template: HTML_TEMPLATE.CONFIRM_EMAIL,
        params: { link: `${req.protocol}://${req.get('host')}/user/welcome?token=${otp.otp_token}` },
      })
    );

    await new Email().send({
      to: email,
      subject: 'Email confirm register',
      html: replacePlaceholder({
        template: HTML_TEMPLATE.CONFIRM_EMAIL,
        params: { link: `${req.protocol}://${req.get('host')}/user/welcome?token=${otp.otp_token}` },
      }),
    });

    return {
      message: 'Send email successful!',
    };
  };
}

module.exports = UserService;
