const router = require("express").Router();
const {
  sendOTP,
  userLogin,
  verifyOTP,
  updateUserDetail,
  refreshToken,
  logout,
} = require("../controller/auth-controller.js");
const {
  createConstants,
  UpdateConstants,
} = require("../controller/constants-controller.js");
const { getUserDetails } = require("../controller/user-details-controller.js");
const {
  addOrDeleteUserRole,
} = require("../controller/user-roles-controller.js");
const {
  validateUserExists,
  authValidate,
  loginValidate,
  verifyOTPValidate,
  updateUserValidate,
  refreshTokenValidate,
  getUserValidate,
  logoutValidate,
} = require("../middleware/auth.js");
const { constantsValidate } = require("../middleware/constants.js");
const { userRolesValidate } = require("../middleware/users.js");

// Send OTP endpoint validateUserExists,
router.post("/auth/otp/", authValidate, sendOTP);

// Login with OTP
router.post("/auth/otp/login", loginValidate, userLogin);

// Verify OTP
router.post("/auth/otp/verify", verifyOTPValidate, verifyOTP);

// Create constants
router.post("/constants", constantsValidate, createConstants);

// Update constants
router.put("/constants", constantsValidate, UpdateConstants);

// Update user details
router.put("/user", updateUserValidate, updateUserDetail);

// Get user details
router.get("/user", getUserValidate, getUserDetails);

// Create accessToken and refreshToken
router.post("/refresh-token", refreshTokenValidate, refreshToken);

// User logout
router.get("/logout", logout);

// Add user roles
router.post("/user/roles/:userId", userRolesValidate, addOrDeleteUserRole);

// Delete user roles
router.delete("/user/roles/:userId", userRolesValidate, addOrDeleteUserRole);

module.exports = router;
