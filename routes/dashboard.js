var express = require('express');
var passport = require('passport');
var router = express.Router();

var object = {
  name: "Przykładowa lekcja ",
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
      name: "Przykładowe dziecko",
      roots: [0,2,3],
      childs: [1,2,3]
    },
    {
      id: 11,
      name: "Przykładowe dziecko",
      roots: [0],
      childs: [1,2,3]
    },
    {
      id: 12,
      name: "Przykładowe dziecko",
      roots: [0],
      childs: [1,2,3]
    },
    {
      id: 13,
      name: "Przykładowe dziecko",
      roots: [0],
      childs: [1,2,3]
    }
  ]
};

router.get('/', isLoggedIn, function(req, res) {
  var id = 0;
  res.render('dashboard', {
    name: "Przykładowa lekcja ",
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
        name: "Przykładowe dziecko",
        roots: [0,2,3],
        childs: [1,2,3]
      },
      {
        id: 11,
        name: "Przykładowe dziecko",
        roots: [0],
        childs: [1,2,3]
      },
      {
        id: 12,
        name: "Przykładowe dziecko",
        roots: [0],
        childs: [1,2,3]
      },
      {
        id: 13,
        name: "Przykładowe dziecko",
        roots: [0],
        childs: [1,2,3]
      }
    ]
  });
});

router.get('/:id', isLoggedIn, function(req, res) {
  var id = req.params.id;
  res.render('dashboard', object);
});


module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/');
}
