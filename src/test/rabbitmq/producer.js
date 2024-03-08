const amqp = require('amqplib');
const message = 'hello RabitMQ';
const queueName = 'test-queue-name';
const runProducer = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertQueue(queueName, {
      durable: true,
    });

    await channel.sendToQueue(queueName, Buffer.from(message));
    console.log(`message sent:`, message);
    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error(error);
  }
};

runProducer().catch((mess) => console.log(mess));
