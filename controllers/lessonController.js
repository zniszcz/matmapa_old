var mongoose = require('mongoose');
var Lesson = require('../models/lesson.js');

// var c = [];
//
// c[0] = new Lesson({
//   id: 0,
//   name: "Jestem rootem",
//   description: "Mam troje dzieci - 1, 2 i 5",
//   rootsID: [0],
//   childsID: [1,2]
// });
// c[1] = new Lesson({
//   id: 1,
//   name: "Jestem najstarszy. Mam dwoje dzieci",
//   rootsID: [0],
//   childsID: [3]
// });
// c[2] = new Lesson({
//   id: 2,
//   name: "Jestem najstarszy, ale nie mam dzieci. Tylko siebie samego żeby przetestować exception później.",
//   rootsID: [0],
//   childsID: [2]
// });
// c[3] = new Lesson({
//   id: 3,
//   name: "Jestem średnim dzieckiem. Mam syna.",
//   rootsID: [1],
//   childsID: [5]
// });
// c[4] = new Lesson({
//   id: 4,
//   name: "Jestem średnim bezdzietnym dzieckiem. Mam siebie samego.",
//   rootsID: [1],
//   childsID: [4]
// });
// c[5] = new Lesson({
//   id: 5,
//   name: "Jestem zjebany. Mam dwóch ojców.",
//   rootsID: [0,3],
//   childsID: [5]
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
