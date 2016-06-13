var Lesson = require('../models/lesson.js');

var root = new Lesson({
  name: "Dodawanie"
});

root.save(function(err) {
    if(err) throw err;

    console.log("Zapisałem dodawanie");
});

var sample = {
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

function object (id) {
  return sample;
}
module.exports = object;
