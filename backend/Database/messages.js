const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserData"
    },
    content : {
        type: String,
        trim:true
    },
    chat : {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Chats"
    }
}, {
    timestamps:true
})

const messageModel = new mongoose.model('Messages', messageSchema)
module.exports = messageModel