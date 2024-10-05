const express = require("express");
const router = express.Router();
const {
  calculateProfit,
  removeUser,
  addUser,
  getAllUsers,
} = require("../controllers/userController");

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

router
  .route("/all")
  .get([authenticateUser, authorizePermissions("admin")], getAllUsers);
router.route("/profit").get(authenticateUser, calculateProfit);
router
  .route("/create")
  .post([authenticateUser, authorizePermissions("admin")], addUser);
router
  .route("/remove/:id")
  .delete([authenticateUser, authorizePermissions("admin")], removeUser);

module.exports = router;
