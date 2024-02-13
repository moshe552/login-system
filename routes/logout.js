exports.logout = function(req, res) {
  req.session.destroy((err) => {
      if (err) {
          console.error('Session destruction error:', err);
          return res.redirect('/');
      }
      res.clearCookie('session_cookie_name');
      res.redirect('/');
  });
};
