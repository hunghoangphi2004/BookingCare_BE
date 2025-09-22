// models/message.model.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // nếu private chat
    content: { type: String, required: true },
    type: { type: String, enum: ["text", "image"], default: "text" },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // đọc rồi
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
