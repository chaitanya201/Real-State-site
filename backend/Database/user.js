const mongoose = require("mongoose")
// connecting MongoDB 
mongoose.connect('mongodb://localhost:27017/RealStateData', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}, ()=>{
    console.log("MongoDB connected..")
})

// defining schema
const userSchema = new mongoose.Schema({
    name: String,
    email: {type: String, unique: true},
    mobile: {type:String, unique:true},
    password: String,
    pic: {type: String, default: "dummy image 4.png"},
    wishlist:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'property',
            unique: true
        }
    ]
    
})

const userModel = new mongoose.model("UserData", userSchema)



module.exports = userModel;