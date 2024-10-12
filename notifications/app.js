require("dotenv").config();
const express = require("express");

const {
  connectRabbitMQ,
  startConsumer,
} = require("./services/rabbitMQService");
const {
  sendWindFarmNotification,
} = require("./controllers/notificationController");

const app = express();
app.use(express.json());

connectRabbitMQ().then(() => {
  // Start consuming messages from RabbitMQ
  startConsumer(sendWindFarmNotification);
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Notification service running on port ${PORT}`);
});
