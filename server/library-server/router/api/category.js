const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/test");
const Schema = mongoose.Schema;
const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false
  }
);
const categoryData = mongoose.model("Category", categorySchema);

router.get("/", async (req, res) => {
  try {
    const categories = await categoryData.find();
    res.json(categories);
  } catch (error) {
    res.json({ error: error });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const category = new categoryData({ name });
    await category.save();
    res.json(category);
  } catch (error) {
    res.sendStatus(400);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const category = await categoryData.findById(req.params.id);
    res.json(category);
  } catch (error) {
    res.sendStatus(400);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await categoryData.findByIdAndUpdate(id, req.body);
    res.json({ id, ...req.body });
  } catch (error) {
    res.sendStatus(400);
  }
});

router.delete("(/:id)", async (req, res) => {
  try {
    await categoryData.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(400);
  }
});

module.exports = router;
