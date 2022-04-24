const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  author: {
    type: String,
    default: "",
  },
  authorType: {
    type: String,
  },
  subject: {
    type: String,
    default: "",
  },
  academicYear: {
    type: Number,
  },
  department: {
    type: String,
    default: "",
  },
  file: {
    type: Object,
    required: true,
  },
  fileType: {
    type: String,
    default: "",
  },
  upvotes: {
    type: Array,
    default: [],
  },
  upvoteCount: {
    type: Number,
    default: 0,
  },
  downvotes: {
    type: Array,
    default: [],
  },
  downvoteCount: {
    type: Number,
    default: 0,
  },
  downloads: {
    type: Number,
    default: 0,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
