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
  nominalPower: {
    type: Number,
    required: [true, "Nominal Power (Pn) is required"],
  },
  Vmin: {
    type: Number,
    default: 3,
  },
  Vfull: {
    type: Number,
    default: 10,
  },
  Vmax: {
    type: Number,
    default: 20,
  },
});

const WindFarmType = mongoose.model("WindFarmType", WindFarmTypeSchema);

module.exports = WindFarmType;
