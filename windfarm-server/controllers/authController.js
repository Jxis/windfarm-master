const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { createJWT } = require("../utils/jwt");
const amqp = require("amqplib");
const { sendLoginNotification } = require("../services/rabbitMQService");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new CustomError.BadRequestError(
        "Please provide email and password"
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new CustomError.UnauthenticatedError("Invalid credentials");
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new CustomError.UnauthenticatedError("Invalid credentials");
    }

    const jwtToken = createJWT(user);
    const message = JSON.stringify({
      email: user.email,
      message: `User ${user.email} has logged in.`,
    });

    await sendLoginNotification(message); // Send notification to RabbitMQ
    res.status(StatusCodes.OK).json({ email: user?.email, jwtToken });
  } catch (error) {
    console.error("Login Error:", error); // Log the actual error to the console
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

const register = async (req, res) => {
  const { email, password } = req.body;

  console.log("Register Request Body:", req.body);

  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }

  const isEmailInUse = await User.findOne({ email });
  console.log("Is Email In Use:", isEmailInUse);

  if (isEmailInUse) {
    throw new CustomError.BadRequestError("Provided Email is in use.");
  }

  const user = await User.create({ email, password });

  res.status(StatusCodes.CREATED).json({
    message: `${user.email} successfully created.`,
  });
};

const logout = async (req, res) => {
  res.status(StatusCodes.OK).json({
    message: "Success",
  });
};

module.exports = {
  register,
  login,
  logout,
};
