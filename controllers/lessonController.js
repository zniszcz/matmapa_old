var mongoose = require('mongoose');
var Lesson = require('../models/lesson.js');

var c = [
  {
    _id: 0,
    name: "Jestem rootem",
    description: "Mam troje dzieci - 1, 2 i 5",
    rootsID: [],
    childsID: [1,2,5]
  },
  {
    _id: 1,
    name: "Jestem najstarszy. Mam dwoje dzieci",
    ID: [0],
    childsID: [3, 2]
  },
  {
    _id: 2,
    name: "Jestem naaajstarszy, ale nie mam dzieci. Tylko siebie samego żeby przetestować exception później.",
    parentsID: [0],
    childsID: []
  },
  {
    _id: 3,
    name: "Jestem średnim dzieckiem. Mam syna.",
    parentsID: [1],
    childsID: [5]
  },
  {
    _id: 4,
    name: "Jesteem średnim bezdzietnym dzieckiem. Mam siebie samego.",
    parentsID: [1],
    childsID: []
  },
  {
    _id: 5,
    name: "Jestem zjebany. Mam dwóch ojców.",
    parentsID: [0,3],
    childsID: []
  }
];

var response = {};

response.init = function () {
  Lesson.find({}).remove(function (err, res) {console.log("wyzerowano bazę");});

  var names = [];
  for(var i in c)
    names.push(c[i].name)

  Lesson.aggregate([{ $match: { name: {$in: names}}}], function (err, res) {
        if(err) throw err;

        var d = [];

        if(res.length > 0)
          console.log("Było "+res.length+" rekordów");
        else {
          for(var i in c)
            d[i] = new Lesson(c[i]);

            Lesson.create(d, function (err, obj) {
              if (err) throw err;
              // console.log(JSON.stringify(obj[0], null, 4));
              for(var i in obj)
                console.log("Zapisałem: ["+obj[i]._id+"] "+obj[i].name)
            });
        }
  });
}

response.getLesson = function (id, callback) {
  return Lesson.findOne({'id': id}, function (err, obj) {
      if(err) throw err;
      console.log(JSON.stringify(obj, null, 4));
  });
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
