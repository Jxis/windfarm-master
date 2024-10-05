import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Map } from '../components/Map'
import useGetWindSpeed from '../hooks/useGetWindSpeed';
import moment from 'moment';
import { useQuery } from '@tanstack/react-query';
import instance from '../axios/instance';
import CalculateProfit from '../components/CalculateProfit';
import CreateWindFarm from '../components/CreateWindFarm';

const start = moment.utc().startOf("day").toISOString();
const end = moment.utc().endOf("day").toISOString();
  
const Home = props => {
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const [windFarmType, setWindFarmType] = useState({});
  const [calculatedTotalProfit, setCalculatedTotalProfit] = useState(null);

  const [windSpeed, setWindSpeed] = useState([]);
  const { fetchWindSpeedData } = useGetWindSpeed();

  const { data: windFarmTypes } = useQuery({
    queryKey: ['WindFarmTypes'],
    queryFn: async () => {
      const response = await instance.get("/wind-farm-type/all");

      return response?.data;
     },
  });

    const { data: windFarms, refetch } = useQuery({
      queryKey: ["WindFarms"],
      queryFn: async () => {
        const response = await instance.get("/wind-farm/all");

        return response?.data;
      },
    });



  return (
    <div style={{ display: "flex", gap: 32 }}>
      <Map
        setCoordinates={setCoordinates}
        coordinates={coordinates}
        windFarms={windFarms}
      />
      <div>
        <div>
          <p>Selected Coordinates</p>
          <p>Lat: {coordinates.lat}</p>
          <p>Lng: {coordinates.lng}</p>
        </div>
        <button
          onClick={async () => {
            const currentWindSpeed = await fetchWindSpeedData({
              lat: coordinates.lat,
              lng: coordinates.lng,
              start,
              end,
            });

            if (currentWindSpeed) {
              setWindSpeed(currentWindSpeed);
            }
          }}
        >
          Get Todays Wind Speed
        </button>
        {windSpeed?.map((data, index) => {
          return (
            <div>
              <p>
                Date:{" "}
                {`${moment(windSpeed[index]?.time).format(
                  "YYYY-MM-DD HH:mm"
                )} - ${moment(windSpeed[index + 1]?.time).format(
                  "YYYY-MM-DD HH:mm"
                )}`}
              </p>
              <p>Wind Speed: {data?.windSpeed?.noaa}</p>
            </div>
          );
        })}
        {windSpeed && (
          <>
            <CalculateProfit
              data={windFarmTypes?.windFarmTypes}
              period={windSpeed}
              setWindFarmType={setWindFarmType}
              setCalculatedTotalProfit={setCalculatedTotalProfit}
            />
            {calculatedTotalProfit && (
              <CreateWindFarm
                windFarmType={windFarmType}
                coordinates={coordinates}
                refetch={refetch}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

Home.propTypes = {}

export default Home