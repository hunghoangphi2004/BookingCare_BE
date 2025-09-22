// models/room.model.js
const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    members: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
  },
  { timestamps: true }
);

roomSchema.index({ members: 1 });

module.exports = mongoose.model("Room", roomSchema);
