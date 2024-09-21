const mongoose= require('mongoose')
const bcrypt = require('bcrypt');
const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required: True
    },
    username:{
        type:String,
        required: True,
        unique: True,
        lowercase: True
    },
    password:{
        type: String,
        required: True,
        minlength: [6, 'Too short password']
    },
    role:{
        type: String,
        enum: ['user','admin'],
        default: 'user'
    },
    active:{
        type: Boolean,
        default: true

    }
}, {timestamps:true});


// hashing password before saving user
UserSchema.pre('save', async function (next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
})

//Comparing passwords
UserSchema.methods.comparePassword = function (password){
    return bcrypt.compare(password, this.password);
};


const User = mongoose.model('User',UserSchema)
module.exports = User;