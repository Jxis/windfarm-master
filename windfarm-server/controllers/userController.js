const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { register } = require("../controllers/authController");

const calculateProfit = async (req, res) => {
  res.send("THIS WORKS");
};

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");

  res.status(StatusCodes.OK).json({
    users,
    count: users.length,
  });
};

const removeUser = async (req, res) => {


  const { id } = req.params;

  if (!id) {
    throw new CustomError.BadRequestError("Id is required");
  }

  const user = await User.findOne({ _id: id });

  if (!user) {
    throw new CustomError.NotFoundError(
      `User not found with provided ID: ${id}`
    );
  }

  await user.remove();

  res
    .status(StatusCodes.OK)
    .send({ msg: `User with ID ${id} has been deleted successfully` });
};

const addUser = async (req, res) => {
  await register(req, res);
};

module.exports = {
  calculateProfit,
  getAllUsers,
  removeUser,
  addUser,
};
