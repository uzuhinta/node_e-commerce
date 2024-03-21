const otpModel = require('#src/models/otp.model.js');
const crypto = require('crypto');

class OtpService {
  static newOtp = async ({ email }) => {
    const token = this.generatorToken();
    const otp = await otpModel.create({
      otp_token: token,
      otp_email: email,
    });
    return otp;
  };

  static generatorToken = () => {
    const token = crypto.randomInt(0, Math.pow(2, 32));
    return token;
  };
}

module.exports = OtpService;
