const mongoose= require('mongoose')
const bcrypt = require('bcrypt');
const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    username:{
        type:String,
        required: true,
        unique: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true,
        minlength: [5, 'Too short password']
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