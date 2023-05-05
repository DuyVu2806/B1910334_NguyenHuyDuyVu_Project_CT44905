const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const verifyToken = require("../helper/jwt").verifyToken;
require("dotenv/config");
const { updateUserPassword, updateUser } = require("../controller/user");

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server." });
  }
});

router.get("/:userId", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server." });
  }
});

router.get("/check/check-email", async (req, res) => {
  const { email } = req.query;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      res.status(400).json({ message: true });
    } else {
      res.status(200).json({ message: false });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    // Kiểm tra xem email đã được sử dụng chưa
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã được sử dụng." });
    }

    // Kiểm tra xem tên người dùng đã được sử dụng chưa
    const existingUsername = await User.findOne({
      username: req.body.username,
    });
    if (existingUsername) {
      return res
        .status(400)
        .json({ message: "Tên người dùng đã được sử dụng." });
    }
    // Tạo một bản ghi người dùng mới
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    const newUser = await user.save();

    // Tạo JWT và trả về cho người dùng
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);
    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Đăng ký không thành công. Vui lòng thử lại." });
  }
});

router.post("/login", async (req, res) => {
  try {
    // Kiểm tra xem email có tồn tại không
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email hoặc mật khẩu không chính xác." });
    }

    // Kiểm tra xem mật khẩu có đúng không
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Email hoặc mật khẩu không chính xác." });
    }

    // Tạo JWT và trả về cho người dùng
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET
    );
    res.json({ token });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Đăng nhập không thành công. Vui lòng thử lại." });
  }
});

router.put("/:id/password", verifyToken, updateUserPassword);

router.put("/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = await updateUser(userId, req.body);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server." });
  }
});

router.get("/protected-route", verifyToken, async (req, res) => {
  try {
    // Lấy thông tin của người dùng đã xác thực từ cơ sở dữ liệu
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ message: "Người dùng không tồn tại." });
    }
    res.json({
      message: `Chào mừng ${user.username} đến với route được bảo vệ.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server." });
  }
});

router.get(`/get/count`,verifyToken, async (req, res) => {
  const userCount = await User.countDocuments();
  if (!userCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    userCount: userCount,
  });
});

module.exports = router;
