
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = require('mongodb').ObjectId;
// var autoIncrement = require('mongoose-auto-increment');
// var connection = mongoose.createConnection(require('../config/database.js').url);

// autoIncrement.initialize(connection);

var lessonSchema = new Schema({
    // _id: {
    //   type: ObjectId,
    //   unique: true,
    //   index: true
    // },
    name: {
      type: String,
      required: true,
      unique: true
    },
    description: String,
    parents:
    []
      // {
      //     type: ObjectId,
      //      ref: 'Lesson'
      // }
    ,
    childs: [
      // {
      //     type: ObjectId,
      //     ref: 'Lesson'
      // }
    ]
});

// lessonSchema.plugin(autoIncrement.plugin, 'Lesson');

var Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;
