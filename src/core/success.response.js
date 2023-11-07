const { StatusCodes, ReasonPhrases } = require('./httpStatusCode');

class SuccessResponse {
  constructor({ message, statusCode = StatusCodes.OK, reasonStatusCode = ReasonPhrases.OK, metadata }) {
    this.message = !message ? reasonStatusCode : message;
    this.statusCode = statusCode;
    this.metadata = metadata;
  }

  // eslint-disable-next-line no-unused-vars
  send(res, headers = {}) {
    res.status(this.statusCode).json(this);
  }
}

class OkResponse extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, metadata });
  }
}

class CreatedResponse extends SuccessResponse {
  constructor({ message, metadata, statusCode = StatusCodes.CREATED, reasonStatusCode = ReasonPhrases.CREATED }) {
    super({ message, metadata, statusCode, reasonStatusCode });
  }
}

module.exports = {
  OkResponse,
  CreatedResponse,
};
