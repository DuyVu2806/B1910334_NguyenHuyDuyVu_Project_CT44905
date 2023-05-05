const express = require("express");
const Customer = require("../models/customer");
const router = express.Router();
require("dotenv/config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require("../helper/jwt").verifyToken;
const authenticateToken = require("../helper/jwtCustomer").authenticateToken;

router.get("/", verifyToken, async (req, res) => {
  try {
    const customer = await Customer.find();
    res.json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server." });
  }
});

router.post("/register", async (req, res) => {
  try {
    const existingCustomer = await Customer.findOne({ email: req.body.email });
    if (existingCustomer) {
      return res.status(400).json({ message: "Email đã được sử dụng." });
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const customer = new Customer({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    const newCustomer = await customer.save();
    const token = jwt.sign(
      { userId: newCustomer._id, username: customer.username },
      process.env.JWT_SECRET_CUSTOMER
    );
    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Đăng ký không thành công. Vui lòng thử lại." });
  }
});

router.get("/check/check-email", async (req, res) => {
  const { email } = req.query;
  try {
    const user = await Customer.findOne({ email: email });
    if (user) {
      res.status(400).json({ message: true });
    } else {
      res.status(200).json({ message: false });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    // Kiểm tra xem email có tồn tại không
    const customer = await Customer.findOne({ email: req.body.email });
    if (!customer) {
      return res
        .status(400)
        .json({ message: "Email hoặc mật khẩu không chính xác." });
    }

    // Kiểm tra xem mật khẩu có đúng không
    const isMatch = await bcrypt.compare(req.body.password, customer.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Email hoặc mật khẩu không chính xác." });
    }

    // Tạo JWT và trả về cho người dùng
    const token = jwt.sign(
      { userId: customer._id, username: customer.username },
      process.env.JWT_SECRET_CUSTOMER
    );
    res.json({ token });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Đăng nhập không thành công. Vui lòng thử lại." });
  }
});

router.get("/:customerId", authenticateToken, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.customerId);
    if (!customer) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }
    res.json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server." });
  }
});

router.put("/:customerId", authenticateToken, async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.customerId,
      req.body,
      { new: true }
    );
    if (!updatedCustomer) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy khách hàng." });
    }
    res.json(updatedCustomer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server." });
  }
});

router.get(`/get/count`, verifyToken, async (req, res) => {
  const customerCount = await Customer.countDocuments();
  if (!customerCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    customerCount: customerCount,
  });
});

module.exports = router;
