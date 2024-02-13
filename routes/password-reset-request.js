require("dotenv").config();
const { queryAsync } = require("../db");
const { sendEmail } = require("../utils/sendEmail");
const crypto = require("crypto");

exports.load = function (req, res) {
  res.render("password-reset-request", {
    title: "Password Reset Request Page",
    message: "Reset Password Request, Enter Your Email:",
  });
};

exports.sendResetLInkToEmail = async function (req, res) {
  const { email } = req.body;
  const users = await queryAsync("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  if (users.length > 0) {
    const user = users[0];
    const token = crypto.randomBytes(20).toString("hex");
    const expiration = new Date(Date.now() + 3600000); // 1 hour from now
    await queryAsync(
      "UPDATE users SET password_reset_token = ?, token_expiration = ? WHERE email = ?",
      [token, expiration, email]
    );
    const resetLink = `${process.env.APP_URL}/reset-password?token=${token}`;
    sendEmail(
      user.email,
      "Password Reset",
      `Please click on the following link to reset your password: ${resetLink}`
    );
    res.render("password-reset-request", {
      title: "Password Reset Request Page",
      message: "If an account with that email exists, a password reset link has been sent."
    });
  } else {
    res.render("password-reset-request", {
      title: "Password Reset Request Page",
      message: "If an account with that email exists, a password reset link has been sent."
    }); // Avoid revealing whether an email is registered
  }
};
