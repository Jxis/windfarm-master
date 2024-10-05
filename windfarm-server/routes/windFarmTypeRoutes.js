const express = require("express");
const router = express.Router();
const {
  createWindFarmType,
  modifyWindFarmType,
  getAllWindFarmTypes,
} = require("../controllers/windFarmTypeController");

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

router.route("/all").get([authenticateUser], getAllWindFarmTypes);
router
  .route("/create")
  .post([authenticateUser, authorizePermissions("admin")], createWindFarmType);
router
  .route("/:id")
  .patch([authenticateUser, authorizePermissions("admin")], modifyWindFarmType);

module.exports = router;
