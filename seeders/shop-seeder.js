require('dotenv').config();

const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const Shops = require('../models/Shop');
const Category = require('../models/Category');

async function seedShop(){
    const db = require('../config/keys').MongoURI;
    await mongoose.connect(db,{
        useNewUrlParser: true,
    userUnifiedTopology: true,
    });
    const shopPromises = [];
    const categories = await Category.find({});
    console.log('Fetched Categories:', categories);

    const shops = [
       { name: 'سلسلة مطاعم انس الدمشقي',
        offerAmount: 10,
        offerDescription: 'خصم بقيمة 10% داخل الافرع للتيك اواي والصالة',
        logo: 'https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        cover: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        category: categories.find(cat => cat.name === 'مطاعم')?._id,
        },
        {
            name: 'سلسلة مطاعم اسماك المرشدي',
            offerAmount: 20,
            offerDescription: 'خصم بقيمة 20% داخل صالة المطعم / خصم بقيمة 15% تيك اواي او دليفري',
            logo: 'https://images.pexels.com/photos/775863/pexels-photo-775863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            cover: 'https://images.pexels.com/photos/725992/pexels-photo-725992.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            category: categories.find(cat=> cat.name === 'مطاعم')?._id,
        },
        {
            name: 'مطعم الشاطئ للمأكولات البحرية',
            offerAmount: 10,
            offerDescription: 'خصم بقيمة 10% داخل الافرع للتيك اواي والصالة',
            logo: 'https://images.pexels.com/photos/2871757/pexels-photo-2871757.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            cover: 'https://images.pexels.com/photos/28559536/pexels-photo-28559536.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            category: categories.find(cat=> cat.name === 'مطاعم')?._id,
        }

    ];
    console.log('Shops to be created:', shops);

    for(const shopData of shops){
        const shop = new Shops(shopData);
        shopPromises.push(shop.save());
    }
    try {
        await Promise.all(shopPromises);
        console.log('Shops created successfully');
    } catch (error) {
        console.log('error creating shops',error);
    }finally{
        await mongoose.disconnect();
    }
}
module.exports = seedShop;
