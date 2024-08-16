const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReviews,
  getAdminProducts,
  deleteReview,
} = require("../controllers/productscontroller");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.get("/products", getAllProducts);
router.get(
  "/admin/products",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getAdminProducts
);
router.post("/admin/product/new", isAuthenticatedUser, createProduct);
router.put(
  "/admin/product/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  updateProduct
);
router.delete(
  "/admin/product/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  deleteProduct
);
router.get("/product/:id", getProductDetails);
router.put("/review", isAuthenticatedUser, createProductReview);
router.get("/review", isAuthenticatedUser, getProductReviews);
router.delete("/review", isAuthenticatedUser, deleteReview);

module.exports = router;
