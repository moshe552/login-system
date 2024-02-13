const { body } = require("express-validator");

// Function to validate password
exports.validatePassword = [
    body(
      "password",
      "Password must be 6 or more characters and include at least one lowercase letter, one uppercase letter, one numeric digit, and one special character"
    ).isStrongPassword({
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    }),
    body(
      "confirm_password",
      "Confirm Password field must have the same value as the password field"
    ).custom((value, { req }) => value === req.body.password)
  ];
