var mongoose = require('mongoose');
var Lesson = require('../models/lesson.js');

// var c = [];
//
// c[0] = new Lesson({
//   id: 0,
//   name: "Przykładowy temat nr. 1",
//   description: "Przykładowy opis",
//   rootsID: [0],
//   childsID: [1,2]
// });
// c[1] = new Lesson({
//   id: 1,
//   name: "Przykładowy temat nr. 2",
//   rootsID: [0],
//   childsID: [3]
// });
// c[2] = new Lesson({
//   id: 2,
//   name: "Całkiem inny temat nr. 3",
//   rootsID: [0],
//   childsID: [3]
// });
// c[3] = new Lesson({
//   id: 3,
//   name: "Totalnie inny temat nr. 4",
//   rootsID: [2,1],
//   childsID: [4,5]
// });
//
// for(i in c)
// c[i].save(function(err) {
//     if(err) throw err;
//
//     console.log("Zapisałem dodawanie");
// });


var response = {};
response.sample = {
  id: 0,
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

response.getLesson = function (id) {
  var query = Lesson.findOne({'id': id});
  query.select("id name description childsID rootsID" );
  return query;
}

module.exports = response;
