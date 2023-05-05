const express = require('express');
const app = express();
const userRouter = require('./routes/user');
const productRouter = require('./routes/product');
const categoryRouter = require('./routes/category');
const customerRouter = require('./routes/customer');
const cartRouter = require('./routes/cart');
const orderRouter = require('./routes/order');
const db = require('./database/db');
const bodyPaser = require("body-parser");
const cors = require('cors');


app.use(bodyPaser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});
app.use(cors());
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));


app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/category', categoryRouter);
app.use('/api/customer', customerRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

db.connect;

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

