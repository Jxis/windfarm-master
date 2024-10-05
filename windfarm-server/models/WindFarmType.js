const mongoose = require("mongoose");

const WindFarmTypeSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  efficiency: {
    type: Number,
    min: 500,
    max: 1000,
    required: [true, "Efficiency is required"],
  },
});

const WindFarmType = mongoose.model("WindFarmType", WindFarmTypeSchema);

module.exports = WindFarmType;
