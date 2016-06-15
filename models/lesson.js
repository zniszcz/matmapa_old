
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = require('mongodb').ObjectId;
var autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection(require('../config/database.js').url);

autoIncrement.initialize(connection);

var lessonSchema = new Schema({
    // _id: ObjectId,// unique: true, index: true},
    // id: {type: Number},
    name: {
      type: String,
      required: true,
      unique: false
    },
    description: String,
    parentsID: [
      {type: Number,
      ref: 'Lesson'}
    ],
    childsID: [
      {type: Number,
      ref: 'Lesson'}
    ]
});

var Lesson = mongoose.model('Lesson', lessonSchema);

lessonSchema.plugin(autoIncrement.plugin, 'Lesson');

module.exports = Lesson;
