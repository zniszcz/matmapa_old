var express = require('express');
var router = express.Router();
var passport = require('passport');
var bodyParser = require('body-parser');
var lesson = require('../controllers/lessonController.js');

router.get('/', function (req, res) {
  lesson.getAll( function (obj) {
      console.log(JSON.stringify(obj));
      res.send(obj);
  });
})
router.get('/:id', function (req, res) {
  lesson.getObject( req.params.id, function (obj) {
    if(obj)
      res.send(obj);
    else
      res.send({error: {code: 404}})
  });
})

module.exports = router;
