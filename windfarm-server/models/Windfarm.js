const mongoose = require("mongoose");

const WindFarmSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    location: {
      x: {
        type: Number,
        required: [true, "X-coordinate is required"],
      },
      y: {
        type: Number,
        required: [true, "Y-coordinate is required"],
      },
    },
    windFarmType: {
      type: mongoose.Types.ObjectId,
      ref: "WindFarmType",
      required: [true, "Wind Farm Type is required"],
    },
    profit: {
      type: Number,
      default: 0,
    },
    currentProfit: {
      type: Number,
      default: 0,
    },
    overallProfit: {
      type: Number,
      default: 0,
    },
    profitHistory: [
      {
        profit: {
          type: Number,
          required: true,
          default: 0,
        },
        time: {
          type: String,
        },
      },
    ],
    productionHistory: [
      {
        production: {
          type: Number,
          required: true,
          default: 0,
        },
        time: {
          type: String,
        },
      },
    ],
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const WindFarm = mongoose.model("WindFarm", WindFarmSchema);

module.exports = WindFarm;