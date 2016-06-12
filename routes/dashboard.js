var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/', isLoggedIn, function(req, res) {
  res.render('dashboard');
});

router.get('/:id', isLoggedIn, function(req, res) {
  var object = {
    name: "Przykładowa lekcja "+req.params.id,
    description: "Przykładowa notka",
    roots: [
      {
        id: 1,
        name: "Przykładowy korzeń"
      }
    ],
    childs: [
      {
        id: 10,
        name: "Przykładowe dziecko"
      },
      {
        id: 11,
        name: "Przykładowe dziecko"
      },
      {
        id: 12,
        name: "Przykładowe dziecko"
      },
      {
        id: 13,
        name: "Przykładowe dziecko"
      }
    ]
  };
  res.render('dashboard', object);
});


module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/');
}
