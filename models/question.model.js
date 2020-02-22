const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const Question = new Schema({
    content: String,
    image: String,
    video: String,
    isHtml: Boolean, //if is Html, show content in html without image and video
    isRandomOption: Boolean,
    options: [{
        numbering: String,
        answer: String
    }],
    correctAnswer: String,
    score:Number
}, { collection: 'Question' })
Question.plugin(mongoosePaginate)
module.exports = mongoose.model('Question', Question);