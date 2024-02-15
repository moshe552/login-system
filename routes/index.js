const { verifyToken } = require("../utils/verifyToken");

exports.index = async function (req, res) {
  const verificationResult = await verifyToken({
    token: req.cookies.session_id, // Assuming the session ID is stored in a cookie named 'session_id'
    tableName: 'sessions',
    tokenColumnName: 'session_id',
    expirationColumnName: 'expiry',
    noTokenMessage: "",
    invalidTokenMessage: ""
  });
  // console.log("req.sessionID in the index page:", req.sessionID, "isLoggedIn:", isLoggedIn);
  res.render("index", {
    title: "Home Page",
    message: "Welcome to my website!",
    isLoggedIn: verificationResult.isValid,
  });
};



// module.exports = function(req, res) {
//   const sessionId = req.sessionID;
//   // Example SQL query to update session status or logout timestamp
//   const sql = "UPDATE sessions SET status = 'logged_out', logged_out_at = NOW() WHERE session_id = ?";
//   db.queryAsync(sql, [sessionId]).then(() => {
//     req.session.destroy((err) => {
//       if (err) {
//         console.error('Session destruction error:', err);
//       }
//       res.clearCookie('session_cookie_name');
//       res.redirect('/');
//     });
//   }).catch((err) => {
//     console.error('Error updating session status:', err);
//     res.redirect('/');
//   });
// };



// module.exports = function(req, res) {
//   const userId = req.session.userId; // Assuming the user's ID is stored in the session
//   // Example SQL query to insert logout activity
//   const sql = "INSERT INTO activity_log (user_id, activity_type, timestamp) VALUES (?, 'logout', NOW())";
//   db.queryAsync(sql, [userId]).then(() => {
//     req.session.destroy((err) => {
//       if (err) {
//         console.error('Session destruction error:', err);
//       }
//       res.clearCookie('session_cookie_name');
//       res.redirect('/');
//     });
//   }).catch((err) => {
//     console.error('Error logging activity:', err);
//     res.redirect('/');
//   });
// };
