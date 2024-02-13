const nodemailer = require("nodemailer");
require("dotenv").config();

exports.sendEmail = async function (to, subject, text) {
  console.log("process.env.EMAIL_ADDRESS:", process.env.EMAIL_ADDRESS, "process.env.EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD);
  // Create a transporter
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD
    },
  });


  // Setup email data
  let mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: to,
    subject: subject,
    text: text,
    // html: "<b>Hello world?</b>" // HTML body content if needed
  };

  // Send the email
  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
