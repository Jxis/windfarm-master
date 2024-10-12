const express = require("express");
const {
  sendVerificationEmail,
  verifyEmail,
} = require("../controllers/emailController");
const router = express.Router();

router.post("/register", sendVerificationEmail);
router.get("/verify-email", verifyEmail);

module.exports = router;
