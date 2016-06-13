
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var lessonSchema = new Schema({
    id: Number,
    name: {type: String, required: true, unique: true},
    description: String,
    roots: Array,
    childs: Array
});
var Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;
