var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/', isLoggedIn, function(req, res) {
  res.render('profile');
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/');
}
