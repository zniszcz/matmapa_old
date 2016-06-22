var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Lesson = require('../models/lesson.js');


var c = [
  {
    _id: "000000000000000000000001",
    name: "Jestem rootem",
    description: "Mam troje dzieci - 2, 5 i 6",
    parents: [],
    childs: [
      "000000000000000000000002",
      "000000000000000000000005",
      "000000000000000000000006"
    ]
  },
  {
    _id: "000000000000000000000002",
    name: "Jestem najstarszy. Mam dwoje dzieci",
    parents: [
      "000000000000000000000001"
    ],
    childs: [
      "000000000000000000000003",
      "000000000000000000000004"
    ]
  },
  {
    _id: "000000000000000000000003",
    name: "Jestem naaajstarszy, ale nie mam dzieci. Tylko siebie samego żeby przetestować exception później.",
    parents: [
      "000000000000000000000002"
    ],
    childs: []
  },
  {
    _id: "000000000000000000000004",
    name: "Jestem średnim dzieckiem. Mam syna.",
    parents: [
      "000000000000000000000002"
    ],
    childs: [
      "000000000000000000000006"
    ]
  },
  {
    _id: "000000000000000000000005",
    name: "Jesteem średnim bezdzietnym dzieckiem. Mam siebie samego.",
    parents: [
      "000000000000000000000001"
    ],
    childs: []
  },
  {
    _id: "000000000000000000000006",
    name: "Jestem zjebany. Mam dwóch ojców.",
    parents: [
      "000000000000000000000001",
      "000000000000000000000004"
    ],
    childs: []
  },
  {
    _id: "000000000000000000000007",
    name: "Inny root",
    parents: [],
    childs: []
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
                // console.log(JSON.stringify(obj[i].childs, null, 4))
            });
        }
  });
}

response.getObject = function (query, callback) { // assume the query is ID
    if(isId(query)){
      var id = new mongoose.Types.ObjectId.createFromHexString(query);
      Lesson.find({$or: [{'_id': id}, {'parents': query}, {'childs': query} ]}, function (err, doc) {
          if(err) throw err;

          var object = doc.filter(function(element, index, array){ return query == element._id; //return a[b]._id == id;
          })[0];

          object.childs = doc.filter(
            function(element, index, array){
              for (var i in element.parents)
                if (element.parents[i] == query)
                  return true;
              return false;
            });

          object.parents = doc.filter(
            function(element, index, array){
              for (var i in element.childs)
                if (element.childs[i] == query)
                  return true;
              return false;
            });

          console.log(JSON.stringify(object, null, 4));

          callback(object);
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

response.findObject = function (query, callback) { // query could be an ID, phrase of name or description

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

response.getRoots = function (callback) {
  Lesson.find({ 'parents': []}, function (err, obj) {
    callback(obj);
  });
}

response.createRelation = function (type, id, query, callback) {
    // type zwraca parents
    // Dodaj do tego z ID
    // Dodaj do tych w query

    var types = ['parents', 'childs'];

    if(isId(id)){
      var _id = new mongoose.Types.ObjectId.createFromHexString(id),
          queries = [];
      for (var i in query)
          if(isId(query[i]))
            queries[i] = new mongoose.Types.ObjectId.createFromHexString(query[i]);
          else
            console.log("Został przekazany błędny ID: "+query[i]);


      // Lesson.update({_id: _id}, {$push: {types[type]: queries}}, function (err) {
        // if(err) throw err;
    //     Lesson.update({_id: _id}, {$push: {"childs": _id}}, function (err) {
    //       if(err) throw err;
          // callback();
    //     })
      // });


      Lesson.update({_id: {$in: queries}}, {$push: {childs: _id}},function (err) {
        if(err) throw err;

        Lesson.update({_id: _id }, {$push: {parents: queries}}, function (err) {
          if(err) throw err;
          callback();
        });
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
    var is24Length = (h.length == 24),
        isHexidecimal = (parseInt(h,16).toString(16) === h.toLowerCase()),
        isTweleve = (h.length == 12)

    return is24Length || (isHexidecimal && isTweleve);
}
