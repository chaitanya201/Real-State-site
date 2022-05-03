const mongoose = require("mongoose")

const propertySchema = new mongoose.Schema({
    name: String,
    price: String,
    info: String,
    keywords:[{
        type:String
    }],
    forSale: {type:Boolean, default:false},
    images: [
        {
            type:String, default:'dummy image 4.png'
        }
    ],
    owner : {
        type: mongoose.Schema.Types.ObjectId, ref:"UserData"
    },
    location: {
        lat: {
            type:Number
        },
        lng : {
            type:Number
        }
    }
})

const propertyModel = new mongoose.model('property', propertySchema)
module.exports = propertyModel