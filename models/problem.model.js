const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
//as so as spoj.vn
const Problem = new Schema({
    title: String,
    content: String,
    input:String,
    output:String,
    example:{
        input:String,
        output:String
    },
    correctScore:Number,
    level:String,
    timeLimit:String,
    memoryLimit:String,
    cluster:String,
    language:String,
    sortName:String
}, {
    collection: 'Problem'
});
Problem.plugin(mongoosePaginate)
module.exports = mongoose.model('Problem', Problem);