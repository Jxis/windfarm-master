import React, { useState } from "react";
import { Map } from "../components/Map";
import useGetWindSpeed from "../hooks/useGetWindSpeed";
import { useQuery } from "@tanstack/react-query";
import instance from "../axios/instance";
import moment from "moment";
import CalculateProfit from "../components/CalculateProfit";
import "../styles/css/Home.css";

const start = moment.utc().startOf("day").toISOString();
const end = moment.utc().endOf("day").toISOString();

const Home = () => {
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const [selectedWindFarmId, setSelectedWindFarmId] = useState(null);
  const [calculatedTotalProfit, setCalculatedTotalProfit] = useState(null);
  const [windSpeed, setWindSpeed] = useState([]);
  const [productionData, setProductionData] = useState(null);
  const [predictedProfit, setPredictedProfit] = useState(null);

  const { fetchWindSpeedData } = useGetWindSpeed();

  const { data: windFarms, refetch } = useQuery({
    queryKey: ["WindFarms"],
    queryFn: async () => {
      const response = await instance.get("/wind-farm/all");
      return response?.data;
    },
  });

  const handleGetWindSpeed = async () => {
    if (!selectedWindFarmId) {
      console.error("No wind farm selected!");
      return;
    }

    const currentWindSpeed = await fetchWindSpeedData({
      lat: coordinates.lat,
      lng: coordinates.lng,
      start,
      end,
    });

    if (currentWindSpeed) {
      setWindSpeed(currentWindSpeed);

      const response = await instance.post(
        `/wind-farm/${selectedWindFarmId}/update-production`,
        { windSpeed: currentWindSpeed[0]?.windSpeed?.noaa }
      );

      setProductionData(response?.data?.productionEntry);
    }
  };

  const handlePredictProfit = async () => {
    if (!selectedWindFarmId) {
      console.error("No wind farm selected!");
      return;
    }

    console.log("Selected WindFarm ID: ", selectedWindFarmId);

    try {
      const response = await instance.get(
        `/wind-farm/${selectedWindFarmId}/predicted-profit`
      );

      if (response?.data) {
        console.log("Predicted Profit Data:", response.data);
        setPredictedProfit(response.data.predictedProfit);
      } else {
        console.error("No data in response:", response);
      }
    } catch (error) {
      console.error("Error predicting profit:", error.response?.data || error);
    }
  };

  return (
    <div className="home-container">
      <div style={{ display: "flex", gap: 32 }}>
        <Map
          setCoordinates={setCoordinates}
          coordinates={coordinates}
          windFarms={windFarms}
          setSelectedWindFarmId={setSelectedWindFarmId}
        />
        <div>
          <div className="coordinates-info">
            <p>Selected Coordinates</p>
            <p>Lat: {coordinates.lat}</p>
            <p>Lng: {coordinates.lng}</p>
          </div>

          <button onClick={handleGetWindSpeed}>Get Today's Wind Speed</button>

          {productionData && (
            <div>
              <p>Wind Speed: {productionData?.windSpeed} m/s</p>
              <p>Power Produced: {productionData?.production} kW</p>
            </div>
          )}

          <button onClick={handlePredictProfit}>Predict Profit</button>

          {predictedProfit && (
            <div>
              <h3>Predicted Profit</h3>
              {predictedProfit.map((profit, index) => (
                <div key={index}>
                  <p>
                    Profit for period {index + 1}: {profit}
                  </p>
                </div>
              ))}
            </div>
          )}

          <CalculateProfit
            windFarmId={selectedWindFarmId}
            setCalculatedTotalProfit={setCalculatedTotalProfit}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
