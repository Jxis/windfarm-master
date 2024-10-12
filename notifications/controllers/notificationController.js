const sendEmail = require("../services/emailService");

const sendWindFarmNotification = async (notificationData) => {
  try {
    const { email, message } = notificationData;

    const emailContent = `
      Dear ${email},
      Important event has occurred at Windfarm:
      ${message}
    `;
    await sendEmail(email, "Windfarm Notification", emailContent);
    console.log(`Notification sent to ${email}`);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

module.exports = { sendWindFarmNotification };
