
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = require('mongodb').ObjectId;
var autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection(require('../config/database.js').url);

autoIncrement.initialize(connection);

var lessonSchema = new Schema({
    // // _id: ObjectId,
    id: {type: Number},
    name: {type: String, required: true, unique: true},
    description: String,
    rootsID: Array,
    childsID: Array
});

var Lesson = mongoose.model('Lesson', lessonSchema);

lessonSchema.plugin(autoIncrement.plugin, {model: 'Lesson', field: 'id'});

module.exports = Lesson;
