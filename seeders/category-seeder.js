require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');


async function seedCategory(){
    const db = require('../config/keys').MongoURI;
    await mongoose.connect(db,{
        useNewUrlParser: true,
    userUnifiedTopology: true,
    });
    const categoryPromises = [];
    const categoryDetails =[
        {
            name: 'مطاعم',
            image: 'https://images.pexels.com/photos/776538/pexels-photo-776538.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
            name: 'ملابس',
            image: 'https://images.pexels.com/photos/1020370/pexels-photo-1020370.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        }
    ];
    //create category instances and push promises
    for(const categoryData of categoryDetails){
        const category = new Category(categoryData);
        categoryPromises.push(category.save());
    }
    try {
        await Promise.all(categoryPromises);
        console.log('Categories created successfully');
    } catch (error) {
        console.error('Error creating categories', error);
    } finally{
        await mongoose.disconnect();
    }

}
module.exports = seedCategory;

