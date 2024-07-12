const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userModelSchema = new Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    unique : true,
  },
  password: {
    type: String,
  }
});

const UserBlog = mongoose.model("UserBlog", userModelSchema);

module.exports = UserBlog;
