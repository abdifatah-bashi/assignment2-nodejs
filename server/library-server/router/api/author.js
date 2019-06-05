const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/test");
const Schema = mongoose.Schema;
const authorSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true
    }
  },
  { versionKey: false }
);

const AuthorData = mongoose.model("Author", authorSchema);

router.get("/", async (req, res) => {
  res.json(await AuthorData.find());
});

router.get("/:id", async (req, res) => {
  try {
    res.json(await AuthorData.findById(req.params.id));
  } catch (error) {
    res.sendStatus(400);
  }
});

router.post("/", async (req, res) => {
  try {
    const author = new AuthorData(req.body);
    await author.save();
    res.json(author);
  } catch (error) {
    res.sendStatus(400);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await AuthorData.findByIdAndUpdate(id, req.body);
    res.json({ id, ...req.body });
  } catch (error) {
    res.sendStatus(400);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await AuthorData.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(400);
  }
});

module.exports = router;
