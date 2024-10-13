import React, { useState } from "react";
import { useForm } from "react-hook-form";
import instance from "../axios/instance";

function CalculateProfit({ windFarmId, setCalculatedTotalProfit }) {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      year: 1,
    },
  });
  const [totalProfit, setTotalProfit] = useState(0);

  const onSubmit = async ({ year }) => {
    try {
      const response = await instance.post(
        `/wind-farm/${windFarmId}/calculate-profit`,
        {
          year,
        }
      );

      const { currentProfit, overallProfit } = response.data;
      setTotalProfit(currentProfit);
      setCalculatedTotalProfit(currentProfit);
    } catch (error) {
      console.error("Error calculating profit:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Select Yearly Period:
        <select {...register("year")}>
          {Array.from({ length: 10 }, (_, i) => i + 1).map((year) => (
            <option key={year} value={year}>
              {year} Year(s)
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
