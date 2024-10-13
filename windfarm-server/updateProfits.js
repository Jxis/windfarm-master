require("dotenv").config();
const mongoose = require("mongoose");
const Windfarm = require("./models/Windfarm");
const WindFarmType = require("./models/WindFarmType");
const { calculateDailyPower } = require("./utils/calculateDailyPower");
const connectDB = require("./db/connect");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const PROFIT_MULTIPLIER = 5;

const saveProfitHistory = async (windFarmId) => {
  const windFarm = await Windfarm.findById(windFarmId).populate("windFarmType");

  if (!windFarm) {
    throw new CustomError.NotFoundError(
      `Wind Farm with id: ${windFarmId} was not found`
    );
  }

  const nominalPower = windFarm.windFarmType.nominalPower;

  windFarm.productionHistory.forEach((entry) => {
    const profit = calculateProfit(entry.windSpeed, nominalPower);
    windFarm.profitHistory.push({
      time: entry.time,
      profit: profit * PROFIT_MULTIPLIER,
    });
  });

  await windFarm.save();
  console.log("Profit history updated successfully");
};

function calculatePower(windSpeed, Pn, Vmin = 3, Vfull = 10, Vmax = 20) {
  if (windSpeed < Vmin) {
    return 0;
  } else if (windSpeed >= Vmin && windSpeed <= Vfull) {
    return ((windSpeed - Vmin) / (Vfull - Vmin)) * Pn;
  } else if (windSpeed > Vfull && windSpeed <= Vmax) {
    return Pn;
  } else {
    return 0;
  }
}

function calculateDailyPower(windFarm, windFarmType) {
  const Pn = windFarmType.nominalPower;
  const Vmin = windFarmType.Vmin || 3;
  const Vfull = windFarmType.Vfull || 10;
  const Vmax = windFarmType.Vmax || 20;

  return windFarm.productionHistory.map((entry) => ({
    time: entry.time,
    windSpeed: entry.windSpeed,
    power: calculatePower(entry.windSpeed, Pn, Vmin, Vfull, Vmax),
  }));
}

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
    if (process.env.NODE_ENV !== "production") {
      mongoose.disconnect();
    }
  }
}

updateProfits();
