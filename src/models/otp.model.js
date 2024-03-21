const { model, Schema } = require('mongoose');

const COLLECTION_NAME = 'Otps';
const DOCUMENT_NAME = 'Otp';

const otpSchema = new Schema(
  {
    otp_token: { type: String, require: true },
    otp_email: { type: String, require: true },
    otp_status: { type: String, default: 'pending', enum: ['pending', 'active', 'block'] },
    expireAt: {
      type: Date,
      default: Date.now,
      expires: 60,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, otpSchema);
