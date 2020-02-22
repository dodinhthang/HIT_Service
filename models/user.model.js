const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const User = new Schema({
    phone:String,
    name: String,
    studentId: String,
    class:String,
    group:String,
    isLocked: {
        type:Boolean,
        default:false
    },
    birthDate:{
        type:Date,
        required:true
    },
    from:{
        type:String,
    },
    isOnline: {
        type:Boolean,
        default:false
    },
	role: {
        type:String,
        default:"user"
    },
    timePassChange: Number,
    email:{
        type:String,
        required:true
    },
    pass:{
        type:String,
        required:true
    },
    playId:{
        type: Schema.Types.ObjectId,
        ref: 'Play'
    },
}, { collection: 'User' })

User.plugin(mongoosePaginate)

module.exports = mongoose.model('User', User);