const mongoose = require('mongoose')
const CategorySchema=mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,'please enter category name']
        },
        image:{
            type:String,
            required:false
        }
    }

)

const Category = mongoose.model('Category',CategorySchema);

module.exports = Category;