var express = require('express');
var passport = require('passport');
var router = express.Router();
var bodyParser = require('body-parser');
var lesson = require('../controllers/lessonController.js');

lesson.init();

router.get('/', /* isLoggedIn, */ function(req, res) {

    lesson.findWhere( "this.parents.length == 0", function (obj) {
        res.render('result', {obj: obj});
    });
});

router.get('/:id', /* isLoggedIn, */ function(req, res) {
  lesson.getObject(req.params.id, function (obj) {
    if(obj)
      res.render('lesson', obj);
    else
      res.redirect('/dashboard/')
  });
});

router.get('/:id/parent', function(req, res) {
  lesson.getAll(function (list) {
      var find = list.slice(0);
      for(i in find)
        if(find[i]._id == req.params.id){
          var obj = find[i];
          obj.modal = 'parent';
          // delete list[i];
          obj.list = list;
          return res.render('lesson', obj);
        }
      res.redirect('/dashboard/')
    });
});
router.post('/:id/parent', function(req, res) {
    var query = [];
    for( var i in req.body.id)
      query.push(req.body.id[i].slice(1, (req.body.id[i].length - 1)));
    lesson.createRelation('parents', req.params.id, query, function (err) {
      var param = (err) ? "?error="+err: '';
      res.redirect('/dashboard/'
        +req.params.id+param
      );
    });
});

router.post('/search/', function (req, res) {
  lesson.findObject(req.body.query, function (obj) {
      console.log(JSON.stringify(obj, null, 4));
      res.render('result', {obj: obj});
  });
});

router.post('/:id',  /*isLoggedIn,*/ function (req, res) {
  lesson.createObject(req.params.id , req.body.name , function (id) {
    res.redirect('/dashboard/'+id);
  });
});


module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/');
}
