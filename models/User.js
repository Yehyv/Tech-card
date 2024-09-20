const mongoose= require('mongoose')

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required: True
    },
    username:{
        type:String,
        required: True
    },
    password:{
        type:String,
        required: True
    },
    date:{
        type:Date,
        default: Date.now
    },
    role:{
        type: String,
        enum: ['user','admin'],
        default: 'user'
    }
})
const User = mongoose.model('User',UserSchema)
module.exports = User;