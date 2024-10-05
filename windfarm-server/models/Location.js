const mongoose = require("mongoose");

const LocationSchema = mongoose.Schema({
  x: {
    type: String,
    required: [true, "X is required"],
  },
  y: {
    type: String,
    required: [true, "Y is required"],
  },
});

const Location = mongoose.model("Location", LocationSchema);

module.exports = Location;
