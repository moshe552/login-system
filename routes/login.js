const { queryAsync } = require("../db");
const bcrypt = require("bcrypt");


exports.load = function (req, res) {
  if (req.session.userId) {
    return res.redirect("/"); // Redirect to dashboard if already logged in
  }
  res.render("login", {
    title: "Login Page",
    message: "התחברות למערכת"
  });
};

// loginUser function to authenticate users and initiate a session
exports.loginUser = async function (req, res) {
  // console.log("req.body:", req.body);
  const { usernameOrEmail, password, rememberMe } = req.body;
  try {
    const userArr = await queryAsync(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [usernameOrEmail, usernameOrEmail]
    );
    if (userArr.length > 0) {
      const user = userArr[0];
      const isMatch = await bcrypt.compare(password, user.password); // Assuming user.password is the hashed password from the database
      if (isMatch) {
        // Authentication successful, set user information in the session
        req.session.userId = user.id;
        console.log("req.session.userId in login page:", req.session.userId);
        if (rememberMe === "true") {
          // Extend session for "Remember Me" functionality
          req.session.cookie.maxAge = 365 * 24 * 60 * 60 * 1000; // e.g., year
        } else {
          req.session.cookie.expires = false; // Session ends when browser closes
        }
        res.redirect("/");
      } else {
        // Passwords do not match
        return res.status(401).render("login", {
          title: "Login Page",
          message: "Incorrect username/email or password.",
        });
      }
    } else {
      // No user found with the provided username
      return res.status(401).render("login", {
        title: "Login Page",
        message: "Incorrect username or email.",
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).render("login", {
      title: "Login Page",
      message: "An internal error occurred.",
    });
  }
};

