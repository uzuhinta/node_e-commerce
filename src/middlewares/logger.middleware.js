const Logger = require('#src/loggers/discord.log.js');

const pushToLogDiscord = async (req, res, next) => {
  try {
    console.log('req.get.host');
    Logger.sendToMessage(req.hostname);
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  pushToLogDiscord,
};
