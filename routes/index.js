exports.index = function (req, res) {
  const isLoggedIn = req.session.userId ? true : false;
  console.log("req.session.userId in the index page:", req.session.userId);
  res.render("index", {
    title: "Home Page",
    message: "Welcome to my website!",
    isLoggedIn: isLoggedIn,
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
