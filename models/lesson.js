
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = require('mongodb').ObjectId;
var lessonSchema = new Schema({
    // _id: ObjectId,
    id: Number,
    name: {type: String, required: true, unique: true},
    description: String,
    rootsID: Array,
    childsID: Array
});
var Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;
