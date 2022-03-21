const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  savedPosts: {
    type: Array,
    default: [],
  },
  upvotedPosts: {
    type: Array,
    default: [],
  },
  uploadedPosts: {
    type: Array,
    default: [],
  },
});

UserSchema.plugin(require("passport-local-mongoose"));

const Users = mongoose.model("Users", UserSchema);

module.exports = Users;
