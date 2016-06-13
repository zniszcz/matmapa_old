var express = require('express');
var passport = require('passport');
var router = express.Router();
var getObject = require('../controllers/lessonController.js');


router.get('/', isLoggedIn, function(req, res) {
  var object = getObject(0);
  res.render('dashboard', object);
});

router.get('/:id', isLoggedIn, function(req, res) {
  var object = getObject(req.params.id);
  res.render('dashboard', object);
});


module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/');
}
