const Windfarm = require("../models/Windfarm");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const WindFarm = require("../models/Windfarm");


const getAllWindFarms = async (req, res) => {
  const { _id } = req.user;

  const windFarms = await WindFarm.find({ user: _id });

  res.status(StatusCodes.OK).json({
    windFarms,
    count: windFarms.length,
  })
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
}

const createWindFarm = async (req, res) => {
  const { name, location, windFarmType } = req.body;
  
  const { _id } = req.user;

  const queryLocation = {
    "location.x": parseFloat(location.x),
    "location.y": parseFloat(location.y),
  };

  const windFarm = await Windfarm.findOne(queryLocation);


  if (windFarm) {
    throw new CustomError.BadRequestError(`Wind farm already exists on location: ${location.x} ${location.y}`)
  }

  const windFarmCreate = await Windfarm.create({ name, location, windFarmType, user: _id})

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
  throw new CustomError.NotFoundError(`Wind Farm with id: ${id} was not found`);
}
  
  const { productionHistory } = windFarm;

res.status(StatusCodes.OK).json({
  productionHistory,
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
};
