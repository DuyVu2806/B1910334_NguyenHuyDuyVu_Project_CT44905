const express = require("express");
const Cart = require("../models/cart");
const router = express.Router();

router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.find({ userId: req.params.userId })
      .populate({
        path: "userId",
        model: "Customer",
        select: "username address phone",
      })
      .populate("productId");
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/check/:userId/:productId", async (req, res) => {
  const { userId, productId } = req.params;
  try {
    const cartItem = await Cart.findOne({ userId, productId });
    if (cartItem) {
      return res.status(200).json({ message: true });
    } else {
      return res.status(200).json({ message: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  const cart = new Cart({
    userId: req.body.userId,
    productId: req.body.productId,
    quantity: req.body.quantity,
  });

  try {
    const newCart = await cart.save();
    res.status(201).json(newCart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      { quantity: req.body.quantity },
      { new: true }
    ).populate({
      path: "userId",
      model: "Customer",
      select: "username address phone",
    }).populate("productId");
    res.json(updatedCart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted cart item" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/customer/:userId", async (req, res) => {
  try {
    const result = await Cart.deleteMany({ userId: req.params.userId });
    if (result.deletedCount > 0) {
      res.json({ message: "Deleted all cart items" });
    } else {
      res.json({ message: "No cart items to delete" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/count/:userId", async (req, res) => {
  try {
    const count = await Cart.countDocuments({ userId: req.params.userId });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
