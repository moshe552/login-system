const { queryAsync } = require("../db");
const { validationResult } = require("express-validator");
const { encryptsPassword } = require("../utils/encryptsPassword");
const { verifyToken } = require("../utils/verifyToken");

exports.load = async function (req, res) {
  const token = req.query.token;
  const verificationResult = await verifyToken(token);
  if (verificationResult.isValid) {
  res.status(200).render("reset-password", {
    title: "Reset Password Page",
    message: "Reset Your Password:",
    errors: [],
    token: token,
  });
} else {
  res.status(verificationResult.error ? 500 : 400)
    .render("reset-password", {
      title: "Reset Password Page",
      message: verificationResult.message,
      errors: [],
      token: "",
    });
};
};

exports.resetPassword = async function (req, res) {
  const errors = validationResult(req);
  const { token, password } = req.body;
  if (!errors.isEmpty()) {
    return res.status(400).render("reset-password", {
      title: "Reset Password Page",
      message: ":הרישום נכשל, אנא תקן השגיאות הבאות",
      errors: errors.array(),
      token: token,
    });
  }
  const verificationResult = await verifyToken(token);
  if (!verificationResult.isValid) {
    return res.status(verificationResult.error ? 500 : 400)
    .render("reset-password", {
      title: "Reset Password Page",
      message: verificationResult.message,
      errors: [],
      token: "",
    });
  }
  try {
    // Hash new password
    const encryptedPassword = await encryptsPassword(password);
    // Update user's password and clear reset token and expiration
    await queryAsync(
      "UPDATE users SET password = ?, password_reset_token = NULL, token_expiration = NULL WHERE id = ?",
      [encryptedPassword, verificationResult.user.id]
    );
    res.status(200).render("login", {
      title: "Login Page",
      message: "התחברות למערכת",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).render("reset-password", {
      title: "Reset Password Page",
      message: "An error occurred.",
      errors: [],
      token: token,
    });
  }
};
