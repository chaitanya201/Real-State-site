const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserData",
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Messages",
    },
  },
  {
    timestamps: true,
  }
);

const chatModel = new mongoose.model("Chats", chatSchema);
module.exports = chatModel;
