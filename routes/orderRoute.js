const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { newOrder, myOrder, getSingleOrder, getAllOrders, deleteOrders, updateOrders } = require("../controllers/ordercontroller");

router.post("/order/new",isAuthenticatedUser, newOrder);
router.get("/order/:id",isAuthenticatedUser, authorizeRoles('admin'),getSingleOrder);
router.get("/orders/me",isAuthenticatedUser, myOrder);
router.get("/admin/orders",isAuthenticatedUser,authorizeRoles('admin'), getAllOrders);
router.put("/admin/orders/:id",isAuthenticatedUser, authorizeRoles('admin') ,updateOrders);
router.delete("/admin/orders/:id",isAuthenticatedUser,authorizeRoles('admin'), deleteOrders);

module.exports = router;

