import React, { useState } from "react";
import { useForm } from "react-hook-form";

const PROFIT_MULTIPLIER = 5;

const years = Array.from({ length: 10 }, (v, k) => k + 1);

function calculateTotalProfit({ powerProduced, year}) {
  return year * 365 * powerProduced.reduce(
    (totalProfit, current) => totalProfit + current.power * PROFIT_MULTIPLIER,
    0
  );
}

function calculatePowerForSpeed(windSpeedNoaa, windFarmTypeEfficiency) {
  if (windSpeedNoaa < 3.5 || windSpeedNoaa > 25) return 0;
  if (windSpeedNoaa < 14) return (windSpeedNoaa - 3.5) * 0.035;
  if (windSpeedNoaa < 25) return windFarmTypeEfficiency;
}

function calculatePowerProduction(data, windFarmTypeEfficiency) {
  return data.map((entry) => ({
    time: entry.time,
    power: calculatePowerForSpeed(entry.windSpeed.noaa, windFarmTypeEfficiency),
  }));
}

function CalculateProfit({ data, period, setWindFarmType, setCalculatedTotalProfit }) {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      year: years[0],
      windFarmType: data ? data[0]._id : "",
    },
  });
  const [totalProfit, setTotalProfit] = useState(0);

  const onSubmit = ({ windFarmType, year }) => {
    const currentEfficiency = data?.find((item) => item._id === windFarmType);

    const powerProduced = calculatePowerProduction(period, currentEfficiency);

    const profit = calculateTotalProfit({ powerProduced, year });

    setTotalProfit(profit);
    setCalculatedTotalProfit(profit);
    setWindFarmType(windFarmType);
  };

  if (!data) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Select an Wind Farm Type:
        <select {...register("windFarmType")}>
          <option value="">Select...</option>
          {data?.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name} (Efficiency: {item.efficiency})
            </option>
          ))}
        </select>
      </label>
      <label>
        Select Yearly Period:
        <select {...register("year")}>
          <option value="">Select...</option>
          {years?.map((item) => (
            <option key={item} value={item}>
              {item} Years
            </option>
          ))}
        </select>
      </label>
      <button type="submit">Calculate Profit</button>
      <div>
        <p>Total Profit: {totalProfit}$</p>
      </div>
    </form>
  );
}

export default CalculateProfit;
