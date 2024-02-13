const { body, validationResult } = require("express-validator");
const db = require("../db.js");
const { validatePassword } = require("../utils/validatePassword.js");
const { encryptsPassword } = require("../utils/encryptsPassword.js");

exports.load = function (req, res) {
  res.render("register", {
    title: "Register Page",
    message: "רישום משתמש חדש",
    errors: [],
    formData: {},
  });
};

const validateRegister = [
  body("username")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters long")
    .isAlphanumeric()
    .withMessage("Username must contain only letters and numbers")
    .custom(async (value) => {
      try {
        // console.log("userName:", value);
        const [rows] = await db.queryAsync(
          "SELECT username FROM users WHERE username = ?",
          [value]
        );
        // console.log("rows:", rows.username);
        if (!rows || Object.keys(rows).length === 0) {
          return Promise.resolve();
        }
        // const error = ;
        // error.isValidationError = true;
        return Promise.reject(new Error("Username already in use"));
      } catch (err) {
        console.error(err);
        throw new Error("Database error");
        // error[isDatabaseError] = true;
        // throw error;
      }
    }),
  body("email")
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (value) => {
      try {
        const [rows] = await db.queryAsync(
          "SELECT email FROM users WHERE email = ?",
          [value]
        );
        if (!rows || Object.keys(rows).length === 0) {
          return Promise.resolve();
        }
        return Promise.reject(new Error("E-mail already in use"));
      } catch (err) {
        console.error(err);
        throw new Error("Database error");
      }
    }),
  ...validatePassword
];

exports.newRegister = [
  ...validateRegister,
  async (req, res) => {
    const errors = validationResult(req);
    // console.log("errors:", errors);
    if (!errors.isEmpty()) {
      const dbError = errors.array().find((error) => error.msg === "Database error");
      if (dbError && dbError.msg === "Database error") {
        return res.status(500).json({ message: "Database error" });
      }
      // res.status(400).json({ errors: errors.errors });
      return res.status(400).render("register", {
        title: "Register Page",
        message: ":הרישום נכשל, אנא תקן השגיאות הבאות",
        errors: errors.array(),
        formData: req.body,
      });
    }
    try {
      // Proceed with registration if no validation errors
      const { username, email, password } = req.body;
      // Hash the password
      const encryptedPassword = await encryptsPassword(password);
      // SQL query with placeholders
      const query =
        "INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, NOW())";
      // Using prepared statements to ensure safe queries
      await db.queryAsync(query, [username, email, encryptedPassword]);
      // If there is no error, the user is redirected to the register page
      // res.status(200).json({ message: "Registration successful" });
      res.status(200).render("login", {
        title: "Login Page",
        message: "התחברות למערכת"
      });
    } catch (err) {
      console.error(err);
      res.status(500).render("register", {
        title: "Register Page",
        message: "אירעה שגיאה בעת ניסיון להוסיף משתמש חדש, אנא נסה שוב",
        errors: [{ msg: err.message }],
        formData: req.body,
      });
    }
  },
];
