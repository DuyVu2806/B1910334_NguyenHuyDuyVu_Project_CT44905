const express = require("express");
const Category = require("../models/category");
const router = express.Router();

router.get(`/`, async (req, res) => {
  try {
    const categoryList = await Category.find();

    if (!categoryList) {
      res.status(500).json({ success: false });
    }
    res.send(categoryList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server." });
  }
});

router.post(`/`, async (req, res) => {
  let category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  });
  category = await category.save();
  if (!category) {
    return res.status(404).send("The category cannot be created");
  }
  res.send(category);
});

router.get("/:id", async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res
      .status(500)
      .json({ message: "the category with the given id was not found" });
  }
  res.send(category);
});

router.put("/:id", async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    },
    { new: true }
  );
  if (!category) {
    return res.status(404).send("The category cannot be created");
  }
  res.send(category);
});

router.delete("/:id", async (req, res) => {
  Category.findByIdAndRemove(req.params.id)
    .then((category) => {
      if (category) {
        return res
          .status(200)
          .json({ success: true, message: "the category is deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "the category not found" });
      }
    })
    .catch((err) => {
      return res.status(404).json({ success: false, error: err });
    });
});

router.get(`/get/count`, async (req, res) => {
  const categoryCount = await Category.countDocuments();
  if (!categoryCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    categoryCount: categoryCount,
  });
});

module.exports = router;
