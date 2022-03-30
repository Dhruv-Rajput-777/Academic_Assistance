const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    length: {
      min: 4,
      max: 32,
    },
  },
  savedPosts: {
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
