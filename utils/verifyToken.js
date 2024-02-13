const { queryAsync } = require("../db");

exports.verifyToken = async function (token) {
  if (!token) {
    return { isValid: false, message: "Invalid request, token can't find." };
  }
  try {
    const users = await queryAsync(
      "SELECT * FROM users WHERE password_reset_token = ? AND token_expiration > NOW()",
      [token]
    );
    if (users.length < 1) {
      return { isValid: false, message: "Token is invalid or has expired." };
    }
    return { isValid: true, user: users[0] };
  } catch (error) {
    console.error("Error verifying token:", error);
    return { isValid: false, message: "An internal error occurred.", error };
  }
}
