const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/test");
const Schema = mongoose.Schema;
const orderSchema = new Schema(
  {
    date: {
      type: Date,
      required: true
    }
  },
  { versionKey: false }
);

const OrderData = mongoose.model("Order", orderSchema);

router.get("/", async (req, res) => {
  res.json(await OrderData.find());
});

router.get("/:id", async (req, res) => {
  try {
    res.json(await OrderData.findById(req.params.id));
  } catch (error) {
    res.sendStatus(400);
  }
});

router.post("/", async (req, res) => {
  try {
    const order = new OrderData(req.body);
    await order.save();
    res.json(order);
  } catch (error) {
    res.sendStatus(400);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await OrderData.findByIdAndUpdate(id, req.body);
    res.json({ id, ...req.body });
  } catch (error) {
    res.sendStatus(400);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await OrderData.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(400);
  }
});

module.exports = router;
