const WindFarmType = require("../models/WindFarmType");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const getAllWindFarmTypes = async (req, res) => {
  const windFarmTypes = await WindFarmType.find({});

  res
    .status(StatusCodes.OK)
    .json({ windFarmTypes, amount: windFarmTypes.length });
};

const createWindFarmType = async (req, res) => {
  const { name, efficiency } = req.body;

  const doesWindFarmTypeExist = await WindFarmType.findOne({ name });

  if (doesWindFarmTypeExist) {
    throw new CustomError.BadRequestError("Name must be unique");
  }

  const windFarmType = await WindFarmType.create({ name, efficiency });

  res.status(StatusCodes.CREATED).json({ windFarmType });
};

const modifyWindFarmType = async (req, res) => {
  const { id } = req.params;
  const { name, efficiency } = req.body;

  const windFarmType = await WindFarmType.findOne({ _id: id });

  if (!windFarmType) {
    throw new CustomError.NotFoundError(
      `Windfarm Type with provided ID ${id} not found`
    );
  }

  if (name === undefined && efficiency === undefined) {
    throw new CustomError.BadRequestError(`Name or Efficiency are required`);
  }

  if (efficiency !== undefined && (efficiency < 500 || efficiency > 1000)) {
    throw new CustomError.BadRequestError(
      `Efficiency must be between 500 and 1000`
    );
  }

  // Apply the updates if provided
  if (name !== undefined) {
    windFarmType.name = name;
  }

  if (efficiency !== undefined) {
    windFarmType.efficiency = efficiency;
  }

  await windFarmType.save();

  res.status(StatusCodes.OK).json({ windFarmType });
};

module.exports = {
  createWindFarmType,
  modifyWindFarmType,
  getAllWindFarmTypes,
};
