const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  text: {
    type: String,
    required: true
  },
  created_on: String,
  reported: Boolean
});

const threadSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  created_on: String,
  bumped_on: String,
  reported: Boolean,
  replies: [replySchema]
});

const boardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  threads: [threadSchema]
});

const Board = mongoose.model("Board", boardSchema);

module.exports = Board;
