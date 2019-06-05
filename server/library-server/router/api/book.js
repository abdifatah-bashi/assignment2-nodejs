const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/test");
const Schema = mongoose.Schema;
const bookSchema = new Schema(
  {
    isbn: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    release_year: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    }
  },
  { versionKey: false }
);

const BookData = mongoose.model("Book", bookSchema);

router.get("/", async (req, res) => {
  res.json(await BookData.find());
});

router.get("/:id", async (req, res) => {
  try {
    res.json(await BookData.findById(req.params.id));
  } catch (error) {
    res.sendStatus(400);
  }
});

router.post("/", async (req, res) => {
  try {
    console.log("inside post method");

    const book = new BookData(req.body);
    await book.save();
    res.json(book);
  } catch (error) {
    console.log("inside error:", error);

    res.sendStatus(400);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await BookData.findByIdAndUpdate(id, req.body);
    res.json({ id, ...req.body });
  } catch (error) {
    res.sendStatus(400);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await BookData.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(400);
  }
});

module.exports = router;
