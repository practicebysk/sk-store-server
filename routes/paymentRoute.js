const express = require("express");
const router = express.Router();
const { isAuthenticatedUser } = require("../middleware/auth");
const {
  processPayment,
} = require("../controllers/paymentcontroller");

router.post("/payment/process", isAuthenticatedUser, processPayment);

module.exports = router;
