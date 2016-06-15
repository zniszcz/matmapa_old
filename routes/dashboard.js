var express = require('express');
var passport = require('passport');
var router = express.Router();
var bodyParser = require('body-parser');
var lesson = require('../controllers/lessonController.js');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

lesson.init();

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

router.post('/:id', upload.array(), /*isLoggedIn,*/ function (req, res) {


    lesson.createObject(req.params.id , req.body.name , function (id) {
        return res.redirect('/dashboard/'+id);
    });

});


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

          if(t=='childs')
            query.childs[i] = new Object(q);
          else
            query.roots[i] = new Object(q);


          if(i > 0)
            pass(lesson.getLesson(query[t+'ID'][i]),i, t);
          else if(i <= 0 && t == 'childs')
            pass(lesson.getLesson(query[t+'ID'][i]),i, 'roots');
          else
            callback(query);
        });

      } // pass


      if(query.childsID.length > 0)
        pass(lesson.getLesson(query.childsID[0]), query.childsID.length, 'childs');
      if(query.rootsID.length > 0)
        pass(lesson.getLesson(query.rootsID[0]), query.rootsID.length, 'roots');

  });
}
