var express = require('express');
var passport = require('passport');
var router = express.Router();
var bodyParser = require('body-parser');
var lesson = require('../controllers/lessonController.js');


router.get('/', /* isLoggedIn, */ function(req, res) {
  var object = lesson.getLesson(0);

  prepareObject(object, function (query) {
    res.render('dashboard', query);
  });
});

router.get('/:id', /* isLoggedIn, */ function(req, res) {
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

      function pass(o, i, t) {
        i--;

        o.exec( function (e, q) {
          //query[t].push(q); // wysrywa błąd o tutaj, na przypisaniu q

          if(t=='childs')
            query.childs.push(q);
          else
            query.roots.push(q);

          if(i <= 0 && t == 'childs')
            pass(lesson.getLesson(query[t+'ID'][i]),i, 'roots');
          else if(i > 0)
            pass(lesson.getLesson(query[t+'ID'][i]),i, t);
          else
            callback(query);

        });

      } // pass

      pass(lesson.getLesson(query.childsID[0]), query.childsID.length, 'childs');
      pass(lesson.getLesson(query.rootsID[0]), query.rootsID.length, 'roots');

  });
}
