const {
  discord: { token, chanelId },
} = require('#src/configs/config.js');
const { Client, GatewayIntentBits } = require('discord.js');

class LoggerService {
  constructor() {
    this.client = new Client({
      intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds],
    });

    this.chanelId = chanelId;

    this.client.on('ready', () => console.log(this.client.user.tag));

    this.client.login(token);
  }

  sendToMessage(message = 'message') {
    const chanel = this.client.channels.cache.get(this.chanelId);
    if (!chanel) {
      console.error(`Couldn't find the channel...`, this.chanelId);
    }

    chanel.send(message).catch((err) => console.error(err));
  }
}

module.exports = new LoggerService();
