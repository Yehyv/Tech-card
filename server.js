require('dotenv').config();
const express= require('express')
const mongoose = require('mongoose')
const app = express()
const Shops = require('./models/Shop');
const seedAdmin = require('./seeders/admin-seeder');
const seedUser = require('./seeders/user-seeder');
const seedCategory = require('./seeders/category-seeder');
const seedShop = require('./seeders/shop-seeder');
app.use(express.json());
app.use(express.urlencoded({extended:false}));


//DB connection
const db = require('./config/keys').MongoURI;

//routing
const index = require('./routes/index')
const shop = require('./routes/Shop')
const category = require('./routes/Category');
const user = require('./routes/User');

app.use('/dashboard',(req,res)=>{
    res.json("hey");
})
//user routes
app.use('/',user);


//category routes
app.use('/',category);


//shop routes
app.use('/',shop)


//connecting to mongoose and run the project
mongoose
    .connect(db)
    .then(() => {
        console.log('Connected!')
        app.listen(4000,()=>{
            console.log('Tech-card app running on port 4000')
        })
        // seedAdmin().then(()=>{
        //     console.log("Admin seeding completed");
        //     process.exit(0);
        // }).catch((err)=>{
        //     console.error("error seeding admin", err);
        //     process.exit(1);
        // });
        // seedUser().then(() => {
        //     console.log("User seeding completed");
        // }).catch(err => {
        //     console.error("Error seeding users", err);
        // });
        //////////////////////////
        // seedCategory().then(()=>{
        //     console.log("Category seeding completed");
        //     process.exit(0);
        // }).catch((err)=>{
        //     console.error("error seeding admin", err);
        //     process.exit(1);
        // });
        //////////////////////
        seedShop().then(()=>{
            console.log("Shop seeding completed");
            process.exit(0);
        }).catch((err)=>{
            console.error("error seeding admin", err);
            process.exit(1);
        });

    })   
    .catch((error)=>{
        console.log(error)
    });