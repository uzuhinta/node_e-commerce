const amqp = require('amqplib');

const runProducer = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const notificationExchange = 'notificationEx';
    const notificationQueue = 'notificationQueueProcess';
    const notificationExchangeDLX = 'notificationExDLX';
    const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX';

    await channel.assertExchange(notificationExchange, 'direct', {
      durable: true,
    });

    const queueResult = await channel.assertQueue(notificationQueue, {
      exclusive: false,
      deadLetterExchange: notificationExchangeDLX,
      deadLetterRoutingKey: notificationRoutingKeyDLX,
    });

    await channel.bindQueue(queueResult.queue, notificationExchange);

    const msg = 'a new product';

    console.log('producer msg::', msg);

    await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
      expiration: '10000',
    });

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error(error);
  }
};

runProducer().catch((mess) => console.log(mess));
