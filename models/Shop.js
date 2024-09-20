const mongoose = require('mongoose')
const ShopsSchema = mongoose.Schema(
    {
        name:{
            type: String,
            required:[true,"please enter shop name"]
        },
        offerAmount:{
            type: Number,
            required: true,
            default:0
        },
        offerDescription:{
            type:String,
            required:true
        },
        logo:{
            type:String,
            required:false
        },
        cover:{
            type:String,
            required:false
        },
        category:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required:true
        }
    },
    {
        timestamps:true
    }
)

const Shops = mongoose.model('Shops',ShopsSchema);

module.exports = Shops;