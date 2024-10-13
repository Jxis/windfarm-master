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
