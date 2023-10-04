const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendNotificationEmail = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return true;
    } catch (error) {
        console.error('Failed to send email:', error);
        return false;
    }
};

module.exports = { sendNotificationEmail };
