const mongoose = require("mongoose");
const Product = require("./product");

const cartSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
});

cartSchema.pre("save", async function (next) {
  try {
    const product = await Product.findById(this.productId);
    this.productInfo = product;
    next();
  } catch (err) {
    next(err);
  }
});


module.exports = mongoose.model("Cart", cartSchema);
