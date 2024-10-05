const axios = require("axios");
const moment = require("moment");

function calculatePowerForSpeed(windSpeedNoaa, windFarmTypeEfficiency) {
  //if (windSpeedNoaa < 3.5 || windSpeedNoaa > 25) return 0;
  // ne zelim da imam podatke u bazi koji su 0 zbog liearne regresije
  if (windSpeedNoaa < 14) return (windSpeedNoaa - 3.5) * 0.035;
  if (windSpeedNoaa < 25) return windFarmTypeEfficiency;
}

function calculatePowerProduction(data, windFarmTypeEfficiency) {
  return data.map((entry) => ({
    time: entry.time,
    production: calculatePowerForSpeed(
      entry.windSpeed.noaa,
      windFarmTypeEfficiency
    ),
  }));
}

async function fetchWindSpeedData(windfarm, apiKey, startTime, endTime) {
  const params = {
    lat: windfarm.location.x,
    lng: windfarm.location.y,
    params: "windSpeed",
    start: startTime,
    end: endTime,
  };

  const response = await axios.get(process.env.API_ENDPOINT, {
    params: params,
    headers: { Authorization: apiKey },
  });

  return response.data.hours;
}

async function calculateDailyPower(windfarm, windFarmType) {
  const apiKey = process.env.API_KEY;
  const startTime = moment.utc().startOf("day").toISOString();
  const endTime = moment.utc().endOf("day").toISOString();

  try {
    const windSpeedData = await fetchWindSpeedData(
      windfarm,
      apiKey,
      startTime,
      endTime
    );
    return calculatePowerProduction(windSpeedData, windFarmType?.efficiency);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
}

module.exports = { calculateDailyPower };
