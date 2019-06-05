const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const passport = require("passport");
require("../../config/passport")(passport);
const jwt = require("jsonwebtoken");
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
const User = mongoose.model("User", UserShema);

const hashPassword = async newPassword => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);
    return hashPassword;
  } catch (error) {
    throw error;
  }
};

const comparePassword = async (candidatePassword, hashPassword) => {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, hashPassword);
    return isMatch;
  } catch (error) {
    throw error;
  }
};

module.exports.getUserById = async id => {
  return await User.findById(id);
};

router.post("/register", async (req, res) => {
  try {
    let newUser = new User(req.body);
    newUser.password = await hashPassword(newUser.password);
    const hash = hashPassword(newUser.password);
    const user = await newUser.save();
    res.json({ success: true, msg: "User registered" });
  } catch (error) {
    res.sendStatus(400);
  }
});

// Authenticate
router.post("/authenticate", (req, res) => {
  const { username, password } = req.body;
  User.getUserByUsername(username, (err, user) => {
    if (err) {
      throw err;
    }
    if (!user) {
      return res.json({ success: false, msg: "user not found" });
    }
    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) {
        throw err;
      }
      if (isMatch) {
        const token = jwt.sign(JSON.stringify(user), "mysecret");

        res.json({
          success: true,
          token: "JWT" + token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }
        });
      } else {
        return res.json({ success: false, msg: "Wrong Password" });
      }
    });
  });
});

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ user: req.user });
  }
);

router.delete("/:id", async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);
  res.sendStatus(200);
});

router.get("/", async (req, res) => {
  res.json(await User.find());
});

function authorized(request, response, next) {
  passport.authenticate("jwt", { session: false }, async (error, token) => {
    if (error || !token) {
      response.status(401).json({ message: "Unauthorized baby, " });
    }
    try {
      const user = await User.findOne({
        where: { id: token.id }
      });
      request.user = user;
    } catch (error) {
      next(error);
    }
    next();
  })(request, response, next);
}

router.get(
  "/secret",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    res.json({ message: "Success! You can not see this without a token" });
  }
);

router.post("/login", async (req, res) => {
  if (req.body.username && req.body.password) {
    const { username, password } = req.body;
    var user = await User.findOne({ username });
    if (!user) {
      res.status(401).json({ message: "no such user found" });
    }
    if (comparePassword(password, user.password)) {
      var payload = { id: user.id };
      var token = jwt.sign(payload, "mysecret", { expiresIn: 86400 * 30 });
      res.json({ message: "ok", token: token });
    } else {
      res.status(401).json({ message: "passwords did not match" });
    }
  } else {
    res.sendStatus(400);
  }
});
module.exports = router;
