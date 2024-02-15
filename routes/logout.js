exports.logout = function(req, res) {
      res.clearCookie('session_id');
      res.redirect('/');
};
