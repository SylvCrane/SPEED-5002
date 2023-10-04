const Mailjet = require('node-mailjet');
const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY_PUBLIC,
  process.env.MAILJET_API_KEY_PRIVATE,
);

const sendNotificationEmail = (to, subject, text) => {
  return mailjet
    .post("send", { version: "v3.1" })
    .request({
      Messages: [
        {
          From: {
            Email: "speed5002.noreply@gmail.com",
            Name: "SPEED5002"
          },
          To: [
            {
              Email: to,
            }
          ],
          Subject: subject,
          TextPart: text,
        }
      ]
    })
    .then((response) => {
      console.log("Email sent:", response.body);
    })
    .catch((error) => {
      console.error("Failed to send notification email:", error);
    });
}

module.exports = { sendNotificationEmail };
