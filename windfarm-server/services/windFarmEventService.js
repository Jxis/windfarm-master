const amqp = require("amqplib");

let channel, connection;

const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URI);
    channel = await connection.createChannel();
    await channel.assertQueue("windfarm_notifications");
    console.log("Connected to RabbitMQ");
  } catch (error) {
    console.error("Failed to connect to RabbitMQ:", error);
  }
};

const sendWindFarmEvent = async (eventData) => {
  try {
    channel.sendToQueue(
      "windfarm_notifications",
      Buffer.from(JSON.stringify(eventData))
    );
    console.log("Windfarm event sent:", eventData);
  } catch (error) {
    console.error("Failed to send windfarm event:", error);
  }
};

module.exports = { connectRabbitMQ, sendWindFarmEvent };
