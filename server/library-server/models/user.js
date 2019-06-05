const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserShema = mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});
const User = (module.exports = mongoose.model("User", UserShema));

module.exports.getUserById = (id, callback) => {
  console.log(" I was called with id:", id);
  User.findById(id, callback);
};

module.exports.getUserByUsername = (username, callback) => {
  User.findOne({ username }, callback);
};

module.exports.addUser = (newUser, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};
