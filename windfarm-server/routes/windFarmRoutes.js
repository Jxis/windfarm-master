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
  getPredictedProfit,
  calculateProfitForWindFarm,
  updateWindFarmProduction,
} = require("../controllers/windFarmController");

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

router.route("/create").post([authenticateUser], createWindFarm);
router.route("/all").get([authenticateUser], getAllWindFarms);
router.route("/profit/overall/:id").get([authenticateUser], getOverallProfit);
router.route("/profit/current/:id").get([authenticateUser], getCurrentProfit);
router.route("/profit/history/:id").get([authenticateUser], getProfitHistory);
router
  .route("/production/history/:id")
  .get([authenticateUser], getProductionHistory);
router.route("/:id").get([authenticateUser], getWindFarm);
router
  .route("/:id/predicted-profit")
  .get([authenticateUser], getPredictedProfit);
router.route("/:id/calculate-profit").post(calculateProfitForWindFarm);
router
  .route("/:id/update-production")
  .post([authenticateUser], updateWindFarmProduction);

module.exports = router;
