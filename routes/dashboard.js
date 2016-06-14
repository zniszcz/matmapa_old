var express = require('express');
var passport = require('passport');
var router = express.Router();
var bodyParser = require('body-parser');
var lesson = require('../controllers/lessonController.js');


router.get('/', isLoggedIn, function(req, res) {
  var object = lesson.getLesson(0);

  prepareObject(object, function (query) {
    res.render('dashboard', query);
  });
});

router.get('/:id', isLoggedIn, function(req, res) {
  var object = lesson.getLesson(req.params.id);

  prepareObject(object, function (query) {
    res.render('dashboard', query);
  });
});

// router.post('/:id', isLoggedIn, function (req, res) {
//
//   // TODO: Jeżeli istnieje to aktualizuj a nie dodawaj
//   function exist() {
//     return true;
//   }
//
//   var object;
//
//   if(!exist())
//     object = getObject();
//
//     console.log(req.body);
//
//   res.render('dashboard', object);
// });


module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/');
}

function prepareObject(object, callback) { // TODO: Napewno można inaczej zassać z bazy te obiekty. Mniej chujowo.
  object.exec(function (err, query) {
      if(err) return handleError(err);

      query.childs = [];
      query.roots = [];

      function pass(child, i) {
        i--;

        child.exec( function (e, q) {
          query.childs[i] = q;

          if(i <= 0)
            callback(query);
          else
            pass(lesson.getLesson(query.childsID[i]),i);
        });

      } // pass

      pass(lesson.getLesson(query.childsID[0]), query.childsID.length)

  });
}
