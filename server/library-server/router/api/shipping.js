const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/test");
const Schema = mongoose.Schema;
const shippingSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    postal_code: {
      type: Number,
      required: true
    }
  },
  { versionKey: false }
);

const ShippingData = mongoose.model("Shipping", shippingSchema);

router.get("/", async (req, res) => {
  res.json(await ShippingData.find());
});

router.get("/:id", async (req, res) => {
  try {
    res.json(await ShippingData.findById(req.params.id));
  } catch (error) {
    res.sendStatus(400);
  }
});

router.post("/", async (req, res) => {
  try {
    const shipping = new ShippingData(req.body);
    await shipping.save();
    res.json(shipping);
  } catch (error) {
    res.sendStatus(400);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await ShippingData.findByIdAndUpdate(id, req.body);
    res.json({ id, ...req.body });
  } catch (error) {
    res.sendStatus(400);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await ShippingData.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(400);
  }
});

module.exports = router;
