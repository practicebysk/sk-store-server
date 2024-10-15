const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Order = require("../model/orderModel");
const ErrorHandler = require("../utils/errosHandler");

module.exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const { shippingInfo, orderItems, paymentInfo, itemPrice, shippingPrice } =
    req.body;
  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

// get Single Order

module.exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }
  res.status(200).json({
    success: true,
    order,
  });
});

// get logged in user Order

module.exports.myOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById({ user: req.user._id });
  res.status(200).json({
    success: true,
    order,
  });
});

// get All Orders
module.exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.find();

  let totalAmount = 0;
  order.forEach((order) => {
    totalAmount += order.totalPrice;
  });
  res.status(200).json({
    success: true,
    order,
    totalAmount,
  });
});

// update Order Status -- Admin
module.exports.updateOrders = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.find(req.params.id);

  if (order.orderStatus === "Delivered") {
    return new ErrorHandler("Order not found with this Id", 404);
  }
  order.orderItems.forEach(async (o) => {
    await updateStock(o.product, o.quantity);
  });
  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }
  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });
}

// delete Orders -- Admin
module.exports.deleteOrders = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.find(req.params.id);
  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }
  await order.deleteOne();
  res.status(200).json({
    success: true,
    order,
    totalAmount,
  });
});