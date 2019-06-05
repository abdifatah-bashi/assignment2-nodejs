const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
var passport = require("passport");

// Middelwares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Static folder
app.use(express.static(path.join(__dirname, "public")));
// Routes
app.use("/api/category", require("./router/api/category"));
app.use("/api/book", require("./router/api/book"));
app.use("/api/users", require("./router/api/users"));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", function(req, res) {
  res.json({ message: "Express is up!" });
});

const PORT = 5000;
app.listen(PORT, () => console.log("server is running"));
