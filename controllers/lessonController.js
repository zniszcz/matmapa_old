var mongoose = require('mongoose');
var Lesson = require('../models/lesson.js');

var c = [

{
  name: "Jestem rootem",
  description: "Mam troje dzieci - 1, 2 i 5",
  rootsID: [],
  childsID: [1,2,5]
},
{
  name: "Jestem najstarszy. Mam dwoje dzieci",
  rootsID: [0],
  childsID: [3]
},
{
  name: "Jestem naaajstarszy, ale nie mam dzieci. Tylko siebie samego żeby przetestować exception później.",
  rootsID: [0],
  childsID: []
},
{
  name: "Jestem średnim dzieckiem. Mam syna.",
  rootsID: [1],
  childsID: [5]
},
{
  name: "Jesteem średnim bezdzietnym dzieckiem. Mam siebie samego.",
  rootsID: [1],
  childsID: []
},
{
  name: "Jestem zjebany. Mam dwóch ojców.",
  rootsID: [0,3],
  childsID: []
}];

var response = {};

response.init = function () {
  var names = [];
  for(var i in c)
    names.push(c[i].name)

  Lesson.aggregate([{ $match: { name: {$in: names}}}], function (err, res) {
        if(err) throw err;

        if(res.length > 0)
          console.log("Było "+res.length+" rekordów");
        else
          Lesson.create(c, function (err) {if (err) throw err; console.log("Zapisałem rekordy");});

  });


      // Lesson.findOne(function (err, obj) {
          // console.log("# DUPA");
          // if( !obj) {
            // var lesson = new Lesson(c[i]);


            // console.log(c[i].name);
            // Lesson.create(lesson, function(err, obj) {
            // });
          // }
    // });

  }


response.getLesson = function (id) {
  var query = Lesson.findOne({'id': id});
  query.select("id name description childsID rootsID" );
  return query;
}

response.createObject = function (id, name, callback) {

      // ID jest ID roota

    var query = Lesson.findOne({'name': name},
      function (err, result) {

        if(result) {
           console.log("Potrzeba updatować");
           callback({id: 0});
        } else {

          //
          // parent.exec(function (err, object) {

            var objectParams = {
              name: name,
              rootsID: [id],
              childsID: []
            };

            Lesson.create( objectParams, function (err, object) {
                if(err) throw err;

                var parent = Lesson.findOneAndUpdate({"id": id}, {"$push": {"childsID": object.id}}, function (err, o) {
                  callback(object.id);
                });


            });


        }

      });

}

module.exports = response;
