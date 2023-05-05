const jwt = require("jsonwebtoken");
require('dotenv/config');

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_CUSTOMER);
    req.customerId = decoded.customerId;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Phiên đăng nhập đã hết hạn." });
  }
};

module.exports = { authenticateToken };
