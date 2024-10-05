const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/authController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

//router
//  .route("/register")
//  .post([authenticateUser, authorizePermissions("admin")], register);
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

module.exports = router;
