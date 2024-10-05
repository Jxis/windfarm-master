require("dotenv").config();
const mongoose = require("mongoose");
const Windfarm = require("./models/Windfarm");
const WindFarmType = require("./models/WindFarmType");
const { calculateDailyPower } = require("./utils/calculateDailyPower");
const connectDB = require("./db/connect");

const PROFIT_MULTIPLIER = 5; // Define constants for magic numbers

function calculateDailyProfit(powerData) {
  return powerData.reduce(
    (totalProfit, current) => totalProfit + current.power * PROFIT_MULTIPLIER,
    0
  );
}

function calculateHourlyProfit(powerData) {
  return powerData.map((entry) => ({
    time: entry.time,
    profit: entry.power * PROFIT_MULTIPLIER,
  }));
}

async function fetchWindFarmType(windFarmTypeId) {
  if (!windFarmTypeId) return null;
  return WindFarmType.findById(windFarmTypeId);
}

async function updateProfits() {
  try {
    await connectDB(process.env.MONGO_URI);
    const windfarms = await Windfarm.find({});

    await Promise.all(
      windfarms.map(async (windfarm) => {
        const windFarmType = await fetchWindFarmType(windfarm.windFarmType);
        const power = await calculateDailyPower(windfarm, windFarmType);
        console.log("POWER", power);

        const currentProfit = calculateDailyProfit(power);
        windfarm.productionHistory.push(...power);
        windfarm.currentProfit = currentProfit;
        windfarm.overallProfit += currentProfit;
        windfarm.profitHistory.push(...calculateHourlyProfit(power));

        await windfarm.save();
      })
    );

    console.log("Profits updated successfully");
  } catch (error) {
    console.error("Error updating profits:", error);
  } finally {
    // Only disconnect if this script is running standalone
    if (process.env.NODE_ENV !== "production") {
      mongoose.disconnect();
    }
  }
}

updateProfits();
