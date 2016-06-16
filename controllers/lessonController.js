var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Lesson = require('../models/lesson.js');

var c = [
  {
    // _id: 0,
    name: "Jestem rootem",
    description: "Mam troje dzieci - 1, 2 i 5",
    // roots: [],
    // childs: [1,2,5]
  },
  {
    // _id: 1,
    name: "Jestem najstarszy. Mam dwoje dzieci",
    // parents: [0],
    // childs: [3, 2]
  },
  {
    // _id: 2,
    name: "Jestem naaajstarszy, ale nie mam dzieci. Tylko siebie samego żeby przetestować exception później.",
    // parents: [0],
    // childs: []
  },
  {
    // _id: 3,
    name: "Jestem średnim dzieckiem. Mam syna.",
    // parents: [1],
    // childs: [5]
  },
  {
    // _id: 4,
    name: "Jesteem średnim bezdzietnym dzieckiem. Mam siebie samego.",
    // parents: [1],
    // childs: []
  },
  {
    // _id: 5,
    name: "Jestem zjebany. Mam dwóch ojców.",
    // parents: [0,3],
    // childs: []
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
            console.log((d[i] = new Lesson(c[i]))._id);//tutaj

            Lesson.create(d, function (err, obj) {
              if (err) throw err;
              // console.log(JSON.stringify(obj[0], null, 4));
              for(var i in obj)
                console.log("Zapisałem: ["+obj[i]._id+"] "+obj[i].name)
                // console.log(JSON.stringify(obj[i].childs, null, 4))
            });
        }
  });
}

response.getObject = function (query, callback) {
    if(isId(query)){
      var id = new mongoose.Types.ObjectId.createFromHexString(query);
      Lesson.findOne({'_id': id}, function (err, obj) {
          if(err) throw err;
          // console.log(JSON.stringify(obj, null, 4));
          callback(obj);
      });
    }
    else
      callback();
}
response.getAll = function (callback) {
      Lesson.find({}, function (err, obj) {
          if(err) throw err;
          callback(obj);
      });
}

response.findObject = function (query, callback) {

    // + Potrzebujesz obsługi nieznalezienia obiektu
    // + wtedy napisz obsługę szukania obiektu po id lub nazwie
    // + wtedy obsłuż oddawanie tablicy obiektów które Ci pasują
    //   wtedy stwórz kontroler dodawania relacji
    //   wtedy dopiero możesz zamockować dodawanie relacji do ODMa

  var id, text;

  if(isId(query))
    id = new mongoose.Types.ObjectId.createFromHexString(query);
  else
    text = query;

    Lesson.find({
      $or: [
        {'_id': id},
        {$or: [
          {'name': new RegExp(text, 'i')},
          {'description': new RegExp(text,'i')}
        ]}
      ]
    }, function (err, obj) {
        if(err) throw err;
        // console.log(JSON.stringify(obj, null, 4));
        callback(obj);
    });

}

response.findWhere = function (query, callback) {
    Lesson.find({$where: query}, function (err, obj) {
      if(err) throw err;
      callback(obj);
    });
}

response.createRelation = function (type, id, query, callback) {
    // type zwraca parents
    // Dodaj do tego z ID
    // Dodaj do tych w query

    if(isId(id)){
      var _id = new mongoose.Types.ObjectId.createFromHexString(id),
          queries = [];
      for (var i in query)
          queries[i] = new mongoose.Types.ObjectId.createFromHexString(query[i]);
      Lesson.update({_id: _id}, {$push: {'roots': queries}}, function (err) {
        Lesson.update({_id: _id}, {$push: {"childs": _id}}, function (err) {
          callback();
        })
      });
    }
}

response.createObject = function (id, name, callback) {

      // ID jest ID roota

    var query = Lesson.findOne({'name': name},
      function (err, result) {
        if(err) throw err;
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

function isId(h) {
    var is24Length = (h.length == 24 && typeof h === 'string'),
        isHexidecimal = (parseInt(h,16).toString(16) === h.toLowerCase()),
        isAtLeastTweleve = (h.length == 12)

  return is24Length || (isHexidecimal && isAtLeastTweleve);
}
