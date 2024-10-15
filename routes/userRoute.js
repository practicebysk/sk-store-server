const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  forgetPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getSingleUser,
  updateUserRole,
  getAllUser,
  deleteUser,
} = require("../controllers/usercontroller");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.post("/password/forgot", forgetPassword);
router.put("/password/reset/:token", resetPassword);
router.get("/me", isAuthenticatedUser, getUserDetails);
router.put("/password/update", isAuthenticatedUser, updatePassword);
router.put("/me/update", isAuthenticatedUser, updateProfile);
router.get("/admin/users", isAuthenticatedUser,authorizeRoles("admin") ,getAllUser);
router.get("/admin/user/:id", isAuthenticatedUser,authorizeRoles("admin") ,getSingleUser);
router.put("/admin/user/:id", isAuthenticatedUser,updateUserRole);
router.delete("/admin/user/:id", isAuthenticatedUser,deleteUser);
module.exports = router;
