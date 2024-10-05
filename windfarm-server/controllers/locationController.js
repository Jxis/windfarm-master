const Location = require("../models/Location");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const createLocation = async (req, res) => {
    const { x, y } = req.body;

    if (!x || !y) {
        throw new CustomError.BadRequestError("Both X and Y coordinates are required.")
    }

    const location = await Location.findOne({ x, y });
 
    if (location) {
        throw new CustomError.BadRequestError("Location already exists.")
    }

    const newLocation = await Location.create({ x, y });

    res.status(StatusCodes.OK).json({ location: newLocation });
};


module.exports = {
  createLocation,
};
