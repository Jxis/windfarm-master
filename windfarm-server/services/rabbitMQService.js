const amqp = require("amqplib");
require("dotenv").config();
let channel, connection;

const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URI);
    channel = await connection.createChannel();
    await channel.assertQueue("login_notifications", { durable: false });
    console.log("Connected to RabbitMQ and queue asserted");
  } catch (error) {
    console.error("Failed to connect to RabbitMQ:", error);
  }
};

const sendLoginNotification = async (message) => {
  try {
    if (!channel) {
      await connectRabbitMQ();
    }
    channel.sendToQueue("login_notifications", Buffer.from(message));
    console.log("Message sent to RabbitMQ:", message);
  } catch (error) {
    console.error("Failed to send message to RabbitMQ:", error);
  }
};

module.exports = { connectRabbitMQ, sendLoginNotification };
