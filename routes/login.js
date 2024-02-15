const { queryAsync } = require("../db");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { verifyToken } = require("../utils/verifyToken");

exports.load = async function (req, res) {
  console.log("req.cookies:", req.cookies);
  console.log("req.cookies.session_id:", req.cookies.session_id);
  const verificationResult = await verifyToken({
    token: req.cookies.session_id,
    tableName: "sessions",
    tokenColumnName: "session_id",
    expirationColumnName: "expiry",
    noTokenMessage: "",
    invalidTokenMessage: "",
  });
  if (verificationResult.isValid) {
    return res.redirect("/"); // Redirect to dashboard if already logged in
  }
  res.render("login", {
    title: "Login Page",
    message: "התחברות למערכת",
  });
};

exports.loginUser = async function (req, res) {
  const { usernameOrEmail, password, rememberMe } = req.body;
  try {
    const userArr = await queryAsync(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [usernameOrEmail, usernameOrEmail]
    );
    if (userArr.length > 0) {
      const user = userArr[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const sessionId = uuidv4();
        let cookieOptions = {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        };
        // Correct handling for "Remember Me" functionality
        if (rememberMe === "true") {
          cookieOptions.maxAge = 365 * 24 * 60 * 60 * 1000; // e.g., 1 year
        }
        // If "Remember Me" is not true, do not set maxAge or expires to make it a session cookie
        const expiryTime =
          rememberMe === "true" ? cookieOptions.maxAge : 1 * 60 * 60 * 1000; // e.g., 1 hour
        const expiry = new Date(Date.now() + expiryTime);
        await queryAsync(
          "INSERT INTO sessions (session_id, user_id, ip, expiry) VALUES (?, ?, ?, ?)",
          [sessionId, user.id, req.ip, expiry]
        );
        // Set the cookie with appropriate options
        res.cookie("session_id", sessionId, cookieOptions);
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
    // Updated error handling to not reference sessionId if it's potentially undefined
    return res.status(500).render("login", {
      title: "Login Page",
      message: "An internal error occurred.",
    });
  }
};

// // loginUser function to authenticate users and initiate a session
// exports.loginUser = async function (req, res) {
//   // console.log("req.body:", req.body);
//   const { usernameOrEmail, password, rememberMe } = req.body;
//   try {
//     const userArr = await queryAsync(
//       "SELECT * FROM users WHERE username = ? OR email = ?",
//       [usernameOrEmail, usernameOrEmail]
//     );
//     if (userArr.length > 0) {
//       const user = userArr[0];
//       const isMatch = await bcrypt.compare(password, user.password);
//       if (isMatch) {
//         try {
//           const sessionId = uuidv4();
//           let cookieOptions = {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === "production",
//           };
//           // Extend session for "Remember Me" functionality if requested
//           if (rememberMe === "true") {
//             cookieOptions.maxAge = 365 * 24 * 60 * 60 * 1000; // e.g., 1 year
//           }
//           // Set expiry for database entry
//           const expiry =
//             rememberMe === "true"
//               ? new Date(Date.now() + cookieOptions.maxAge)
//               : new Date(Date.now());
//           await queryAsync(
//             "INSERT INTO sessions (session_id, user_id, ip, expiry) VALUES (?, ?, ?, ?)",
//             [sessionId, user.id, req.ip, expiry]
//           );
//           // Set the cookie with appropriate options
//           res.cookie("session_id", sessionId, cookieOptions);
//           res.redirect("/");
//         } catch (error) {
//           console.error(
//             "Error updating session details for session ID:",
//             error
//           );
//           return res.status(500).render("login", {
//             title: "Login Page",
//             message: "Error updating session details for session ID:",
//             sessionId,
//           });
//         }
//       } else {
//         //  Passwords do not match
//         return res.status(401).render("login", {
//           title: "Login Page",
//           message: "Incorrect username/email or password.",
//         });
//       }
//     } else {
//       // No user found with the provided username
//       return res.status(401).render("login", {
//         title: "Login Page",
//         message: "Incorrect username or email.",
//       });
//     }
//   } catch (error) {
//     console.error("Login error:", error);
//     return res.status(500).render("login", {
//       title: "Login Page",
//       message: "An internal error occurred.",
//     });
//   }
// };

// // loginUser function to authenticate users and initiate a session
// exports.loginUser = async function (req, res) {
//   // console.log("req.body:", req.body);
//   const { usernameOrEmail, password, rememberMe } = req.body;
//   try {
//     const userArr = await queryAsync(
//       "SELECT * FROM users WHERE username = ? OR email = ?",
//       [usernameOrEmail, usernameOrEmail]
//     );
//     if (userArr.length > 0) {
//       const user = userArr[0];
//       const isMatch = await bcrypt.compare(password, user.password);
//       if (isMatch) {
//         // // Update session details in the database
//         // req.session.userId = user.id;
//         // const sessionCheckResult = await queryAsync(
//         //   "SELECT 1 FROM sessions WHERE session_id = ?",
//         //   [req.sessionID]
//         // );
//         // console.log("sessionCheckResult:", sessionCheckResult);
//         try {
//           const sessionId = uuidv4();
//           const expiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // Example: 1 year from now
//           await queryAsync(
//             "INSERT INTO sessions (session_id, user_id, ip, expiry) VALUES (?, ?, ?, ?)",
//             [sessionId, user.id, req.ip, expiry]
//           );
//           res.cookie("session_id", sessionId, {
//             httpOnly: true,
//             expires: expiry,
//             secure: process.env.NODE_ENV === "production",
//           });
//           // Extend session for "Remember Me" functionality if requested
//           if (rememberMe === "true") {
//             req.cookie.maxAge = 365 * 24 * 60 * 60 * 1000; // e.g., year
//           } else {
//             req.cookie.expires = false; // Session ends when browser closes
//           }
//         res.redirect("/");
//         } catch (error) {
//           console.error(
//             "Error updating session details for session ID:",
//             req.sessionID,
//             error
//           );
//         }
//       } else {
//         // Passwords do not match
//         return res.status(401).render("login", {
//           title: "Login Page",
//           message: "Incorrect username/email or password.",
//         });
//       }
//     } else {
//       // No user found with the provided username
//       return res.status(401).render("login", {
//         title: "Login Page",
//         message: "Incorrect username or email.",
//       });
//     }
//   } catch (error) {
//     console.error("Login error:", error);
//     return res.status(500).render("login", {
//       title: "Login Page",
//       message: "An internal error occurred.",
//     });
//   }
// };
