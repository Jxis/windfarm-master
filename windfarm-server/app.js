require("dotenv").config();
require("express-async-errors"); // Adds try catch to all controllers automatically
const PORT = process.env.PORT;
const express = require("express");
const connectDB = require("./db/connect");
const app = express();

const cors = require("cors");

// Middlewares
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// Routes

const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const windFarmTypeRouter = require("./routes/windFarmTypeRoutes");
const windFarmRouter = require("./routes/windFarmRoutes");
const locationRouter = require("./routes/locationRoutes");

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Windfarm API");
});

app.use(`${process.env.BASE_API_URL}/auth`, authRouter);
app.use(`${process.env.BASE_API_URL}/user`, userRouter);
app.use(`${process.env.BASE_API_URL}/wind-farm-type`, windFarmTypeRouter);
app.use(`${process.env.BASE_API_URL}/wind-farm`, windFarmRouter);
app.use(`${process.env.BASE_API_URL}/location`, locationRouter);

app.use(notFoundMiddleware); // We want this middleware to be called first if there is no route
app.use(errorHandlerMiddleware); // This one gets triggered when an error happens on an existing route

const start = async () => {
  try {
    app.listen(PORT, () => {
      connectDB(process.env.MONGO_URI);
      console.log(`App is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

start();
