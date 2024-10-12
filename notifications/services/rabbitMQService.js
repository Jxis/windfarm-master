const amqp = require("amqplib");
require("dotenv").config();

let channel, connection;

const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URI);
    channel = await connection.createChannel();
    await channel.assertQueue("login_notifications", { durable: false });
    console.log("RabbitMQ connected and queue asserted");
  } catch (error) {
    console.error("Failed to connect to RabbitMQ:", error);
  }
};

const startConsumer = async (messageHandler) => {
  try {
    if (!channel) {
      await connectRabbitMQ();
    }

    channel.consume("login_notifications", async (msg) => {
      if (msg !== null) {
        const messageContent = msg.content.toString();
        console.log(`Received message: ${messageContent}`);
        await messageHandler(JSON.parse(messageContent));
        channel.ack(msg);
      }
    });
    console.log("Waiting for messages...");
  } catch (error) {
    console.error("Failed to consume messages:", error);
  }
};

module.exports = { connectRabbitMQ, startConsumer };
