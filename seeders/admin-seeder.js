require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');


//connect to database
const db = require('../config/keys').MongoURI;

async function seedAdmin(){
    //connect to DB
    await mongoose.connect(db , {
        useNewUrlParser: true,
        userUnifiedTopology: true,
    });
    //check if admin already exists
const existingAdmin = await User.findOne({username:'admin2'});

if(!existingAdmin){
    const adminCredentials ={
        name: 'King Yehya',
        username: 'admin',
        password: 'admin',
        role: 'admin'
    }
    const adminUser = new User(adminCredentials);
    await adminUser.save(); // This will trigger the pre-save hook
    console.log("Admin Created successfully");
}
else{
    console.log("Admin user already exists")
}
    await mongoose.disconnect();
}


module.exports = seedAdmin;



