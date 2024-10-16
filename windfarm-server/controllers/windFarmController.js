const Windfarm = require("../models/Windfarm");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const WindFarm = require("../models/Windfarm");
const axios = require("axios");

const calculatePower = (windSpeed, Pn, Vmin = 3, Vfull = 10, Vmax = 20) => {
  if (windSpeed < Vmin) return 0;
  if (windSpeed >= Vmin && windSpeed <= Vfull) {
    return ((windSpeed - Vmin) / (Vfull - Vmin)) * Pn;
  } else if (windSpeed > Vfull && windSpeed <= Vmax) {
    return Pn;
  } else {
    return 0;
  }
};

const updateWindFarmProduction = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.user;

  const windFarm = await WindFarm.findOne({ user: _id, _id: id }).populate(
    "windFarmType"
  );
  if (!windFarm) {
    throw new CustomError.NotFoundError(
      `Wind Farm with id: ${id} was not found`
    );
  }

  const windSpeedData = req.body.windSpeed;

  const windFarmType = windFarm.windFarmType;
  const Pn = windFarmType.nominalPower;
  const Vmin = windFarmType.Vmin;
  const Vfull = windFarmType.Vfull;
  const Vmax = windFarmType.Vmax;

  const productionEntry = {
    time: new Date().toISOString(),
    windSpeed: windSpeedData,
    production: calculatePower(windSpeedData, Pn, Vmin, Vfull, Vmax),
  };

  windFarm.productionHistory.push(productionEntry);

  const profit = productionEntry.production * 5; // PROFIT_MULTIPLIER is 5
  windFarm.profitHistory.push({ time: productionEntry.time, profit });

  windFarm.currentProfit += profit;
  windFarm.overallProfit += profit;

  await windFarm.save();

  res.status(StatusCodes.OK).json({
    windFarm,
    productionEntry,
  });
};

const getAllWindFarms = async (req, res) => {
  const { _id } = req.user;

  const windFarms = await WindFarm.find({ user: _id });

  res.status(StatusCodes.OK).json({
    windFarms,
    count: windFarms.length,
  });
};

const getWindFarm = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.user;

  const windFarm = await WindFarm.findOne({ user: _id, _id: id });

  if (!windFarm) {
    throw new CustomError.NotFoundError(
      `Wind Farm with id: ${id} was not found`
    );
  }

  res.status(StatusCodes.OK).json({
    windFarm,
  });
};

const createWindFarm = async (req, res) => {
  const { name, location, windFarmType } = req.body;

  const { _id } = req.user;

  const queryLocation = {
    "location.x": parseFloat(location.x),
    "location.y": parseFloat(location.y),
  };

  const windFarm = await Windfarm.findOne(queryLocation);

  if (windFarm) {
    throw new CustomError.BadRequestError(
      `Wind farm already exists on location: ${location.x} ${location.y}`
    );
  }

  const windFarmCreate = await Windfarm.create({
    name,
    location,
    windFarmType,
    user: _id,
  });

  res.status(StatusCodes.CREATED).json({ windFarm: windFarmCreate });
};

const getOverallProfit = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.user;

  const windFarm = await WindFarm.findOne({ user: _id, _id: id });

  if (!windFarm) {
    throw new CustomError.NotFoundError(
      `Wind Farm with id: ${id} was not found`
    );
  }

  const { overallProfit } = windFarm;

  res.status(StatusCodes.OK).json({
    overallProfit,
  });
};

const getCurrentProfit = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.user;

  const windFarm = await WindFarm.findOne({ user: _id, _id: id });

  if (!windFarm) {
    throw new CustomError.NotFoundError(
      `Wind Farm with id: ${id} was not found`
    );
  }

  const { currentProfit } = windFarm;

  res.status(StatusCodes.OK).json({
    currentProfit,
  });
};

const getProfitHistory = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.user;

  const windFarm = await WindFarm.findOne({ user: _id, _id: id });

  if (!windFarm) {
    throw new CustomError.NotFoundError(
      `Wind Farm with id: ${id} was not found`
    );
  }

  const { profitHistory } = windFarm;

  res.status(StatusCodes.OK).json({
    profitHistory,
  });
};

const getProductionHistory = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.user;

  const windFarm = await WindFarm.findOne({ user: _id, _id: id });

  if (!windFarm) {
    throw new CustomError.NotFoundError(
      `Wind Farm with id: ${id} was not found`
    );
  }

  const { productionHistory } = windFarm;

  res.status(StatusCodes.OK).json({
    productionHistory,
  });
};

const getPredictedProfit = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.user;

  console.log("Received wind farm ID for prediction:", id);

  const windFarm = await WindFarm.findOne({ user: _id, _id: id });

  if (!windFarm) {
    console.error(`Wind Farm with ID: ${id} not found`);
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: `Wind Farm with id: ${id} was not found` });
  }

  const windSpeedData = windFarm.productionHistory
    .map((entry) => entry.windSpeed)
    .filter((speed) => speed !== undefined && speed !== null);

  const actualProfits = windFarm.profitHistory
    .map((entry) => entry.profit)
    .filter((profit) => profit !== undefined && profit !== null);

  console.log("Filtered wind speed data:", windSpeedData);
  console.log("Filtered actual profit data:", actualProfits);

  if (windSpeedData.length === 0 || actualProfits.length === 0) {
    console.error("No valid data available for prediction");
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Wind speed or profit data is empty" });
  }

  try {
    const response = await axios.post("http://localhost:8001/predict-profit", {
      wind_speed_data: windSpeedData,
      actual_profits: actualProfits,
    });

    console.log("Prediction response from Python service:", response.data);

    res
      .status(StatusCodes.OK)
      .json({ predictedProfit: response.data.predicted_profit });
  } catch (error) {
    console.error("Error predicting profit:", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Error predicting profit",
      error: error.message,
    });
  }
};

const calculateProfitForWindFarm = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.user;

  const windFarm = await WindFarm.findOne({ user: _id, _id: id }).populate(
    "windFarmType"
  );

  if (!windFarm) {
    throw new CustomError.NotFoundError(
      `Wind Farm with id: ${id} was not found`
    );
  }

  const windFarmType = windFarm.windFarmType;

  if (!windFarm.productionHistory || windFarm.productionHistory.length === 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "No wind speed data available for profit calculation" });
  }

  const windSpeedData = windFarm.productionHistory.map((entry) => ({
    time: entry.time,
    windSpeed: entry.windSpeed,
  }));

  const powerData = windSpeedData.map((entry) => {
    return {
      time: entry.time,
      windSpeed: entry.windSpeed,
      power: calculatePower(
        entry.windSpeed,
        windFarmType.nominalPower,
        windFarmType.Vmin,
        windFarmType.Vfull,
        windFarmType.Vmax
      ),
    };
  });

  const profitData = powerData.map((entry) => ({
    time: entry.time,
    profit: entry.power * PROFIT_MULTIPLIER,
  }));

  windFarm.profitHistory.push(...profitData);

  const currentProfit = profitData.reduce(
    (total, entry) => total + entry.profit,
    0
  );
  windFarm.currentProfit = currentProfit;
  windFarm.overallProfit += currentProfit;

  await windFarm.save();

  res.status(StatusCodes.OK).json({
    currentProfit,
    overallProfit: windFarm.overallProfit,
    profitHistory: windFarm.profitHistory,
  });
};

module.exports = {
  createWindFarm,
  getAllWindFarms,
  getWindFarm,
  getOverallProfit,
  getCurrentProfit,
  getProfitHistory,
  getProductionHistory,
  getPredictedProfit,
  calculateProfitForWindFarm,
  updateWindFarmProduction,
};
