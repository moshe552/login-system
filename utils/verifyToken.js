const { queryAsync } = require("../db");

// Generic function to verify tokens or session IDs
exports.verifyToken = async function ({
  token,
  tableName,
  tokenColumnName,
  expirationColumnName,
  noTokenMessage,
  invalidTokenMessage
}) {
  if (!token) {
    return { isValid: false, message: noTokenMessage };
  }
  try {
    const query = `
      SELECT * FROM ${tableName} 
      WHERE ${tokenColumnName} = ? AND ${expirationColumnName} > NOW()
    `;
    const users = await queryAsync(query, [token]);
    if (users.length < 1) {
      return { isValid: false, message: invalidTokenMessage };
    }
    return { isValid: true, user: users[0] };
  } catch (error) {
    console.error("Error verifying token:", error);
    return { isValid: false, message: "An internal error occurred.", error };
  }
}



// const { queryAsync } = require("../db");

// exports.verifyGenericToken = async function (token) {
//   if (!token) {
//     return { isValid: false, message: "Invalid request, token can't find." };
//   }
//   try {
//     const users = await queryAsync(
//       "SELECT * FROM users WHERE password_reset_token = ? AND token_expiration > NOW()",
//       [token]
//     );
//     if (users.length < 1) {
//       return { isValid: false, message: "Token is invalid or has expired." };
//     }
//     return { isValid: true, user: users[0] };
//   } catch (error) {
//     console.error("Error verifying token:", error);
//     return { isValid: false, message: "An internal error occurred.", error };
//   }
// };
