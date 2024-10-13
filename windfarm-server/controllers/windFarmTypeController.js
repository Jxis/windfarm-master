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
  const { name, efficiency, nominalPower, Vmin, Vfull, Vmax } = req.body;

  const doesWindFarmTypeExist = await WindFarmType.findOne({ name });

  if (doesWindFarmTypeExist) {
    throw new CustomError.BadRequestError("Name must be unique");
  }

  // Provera unetih podataka
  if (efficiency < 500 || efficiency > 1000) {
    throw new CustomError.BadRequestError(
      `Efficiency must be between 500 and 1000`
    );
  }

  // Proveri da li su zadate validne vrednosti za Vmin, Vfull, Vmax
  if (Vmin < 0 || Vfull <= Vmin || Vmax <= Vfull) {
    throw new CustomError.BadRequestError(
      `Invalid wind speed values: Vmin should be < Vfull and Vfull < Vmax`
    );
  }

  const windFarmType = await WindFarmType.create({
    name,
    efficiency,
    nominalPower,
    Vmin,
    Vfull,
    Vmax,
  });

  res.status(StatusCodes.CREATED).json({ windFarmType });
};

const modifyWindFarmType = async (req, res) => {
  const { id } = req.params;
  const { name, efficiency, nominalPower, Vmin, Vfull, Vmax } = req.body;

  const windFarmType = await WindFarmType.findOne({ _id: id });

  if (!windFarmType) {
    throw new CustomError.NotFoundError(
      `Windfarm Type with provided ID ${id} not found`
    );
  }

  if (
    name === undefined &&
    efficiency === undefined &&
    nominalPower === undefined &&
    Vmin === undefined &&
    Vfull === undefined &&
    Vmax === undefined
  ) {
    throw new CustomError.BadRequestError(
      `At least one field (name, efficiency, nominalPower, Vmin, Vfull, Vmax) is required`
    );
  }

  if (efficiency !== undefined && (efficiency < 500 || efficiency > 1000)) {
    throw new CustomError.BadRequestError(
      `Efficiency must be between 500 and 1000`
    );
  }

  if (Vmin !== undefined && Vfull !== undefined && Vmax !== undefined) {
    if (Vmin < 0 || Vfull <= Vmin || Vmax <= Vfull) {
      throw new CustomError.BadRequestError(
        `Invalid wind speed values: Vmin should be < Vfull and Vfull < Vmax`
      );
    }
  }

  if (name !== undefined) {
    windFarmType.name = name;
  }

  if (efficiency !== undefined) {
    windFarmType.efficiency = efficiency;
  }

  if (nominalPower !== undefined) {
    windFarmType.nominalPower = nominalPower;
  }

  if (Vmin !== undefined) {
    windFarmType.Vmin = Vmin;
  }

  if (Vfull !== undefined) {
    windFarmType.Vfull = Vfull;
  }

  if (Vmax !== undefined) {
    windFarmType.Vmax = Vmax;
  }

  await windFarmType.save();

  res.status(StatusCodes.OK).json({ windFarmType });
};

module.exports = {
  createWindFarmType,
  modifyWindFarmType,
  getAllWindFarmTypes,
};
