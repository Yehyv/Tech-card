require('dotenv').config();
const express= require('express')
const mongoose = require('mongoose')
const app = express()
const Shops = require('./models/Shop');
app.use(express.json());
app.use(express.urlencoded({extended:false}));


//DB connection
const db = require('./config/keys').MongoURI;

//routing
const index = require('./routes/index')
const shop = require('./routes/Shop')
const category = require('./routes/Category');



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
        
    })   
    .catch((error)=>{
        console.log(error)
    });