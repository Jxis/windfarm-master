const express = require("express");
const router = express.Router();
const { createLocation } = require("../controllers/locationController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

router.route("/create").post([authenticateUser], createLocation);

module.exports = router;
