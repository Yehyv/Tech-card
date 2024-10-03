require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

async function seedUser(){
//connect to database
const db = require('../config/keys').MongoURI;
await mongoose.connect(db, {
    useNewUrlParser: true,
    userUnifiedTopology: true,
})
    const userPromises = [];
    for(let i = 101; i<=200; i++) {
        const userCredentials ={
            name: `User ${i}`,
            username: `user${i}`,
            password: `password${i}`,
            role: 'user'
        };
        const user = new User(userCredentials);
        userPromises.push(user.save()); // Save will trigger the pre-save hook
    }
    try {
        await Promise.all(userPromises);
        console.log('Users created successfully');
    } catch (err) {
        console.error('Error creating users:', err); // Log the error with more detail
    } finally {
        await mongoose.disconnect();
    }
}
module.exports = seedUser;



