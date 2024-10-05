const express = require("express");
const router = express.Router();
const {
  getOverallProfit,
  getCurrentProfit,
  getProfitHistory,
  getProductionHistory,
  createWindFarm,
  getAllWindFarms,
  getWindFarm,
} = require("../controllers/windFarmController");

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");


router.route("/create").post([authenticateUser], createWindFarm);
router.route("/all").get([authenticateUser], getAllWindFarms);
router.route("/profit/overall/:id").get([authenticateUser], getOverallProfit);
router.route('/profit/current/:id').get([authenticateUser], getCurrentProfit);
router.route('/profit/history/:id').get([authenticateUser], getProfitHistory);
router.route('/production/history/:id').get([authenticateUser], getProductionHistory);
router.route("/:id").get([authenticateUser], getWindFarm);

module.exports = router;
