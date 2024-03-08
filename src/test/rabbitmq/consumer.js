const amqp = require('amqplib');
const queueName = 'test-queue-name';
const runConsumer = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertQueue(queueName, {
      durable: true,
    });

    channel.consume(
      queueName,
      (message) => {
        console.log(`message receive:`, message.content.toString());
      },
      {
        noAck: true,
      }
    );
  } catch (error) {
    console.error(error);
  }
};

runConsumer().catch((mess) => console.log(mess));
