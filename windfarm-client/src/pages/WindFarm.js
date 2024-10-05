import React from 'react'
import { useParams } from 'react-router-dom'
import instance from '../axios/instance';
import { useQuery } from '@tanstack/react-query';
import HistoryTable from '../components/HistoryTable';

const WindFarm = () => {
  const {id} = useParams();

     const { data: windFarm, isLoading } = useQuery({
       queryKey: ["WindFarm", id],
       queryFn: async () => {
         const response = await instance.get(`/wind-farm/${id}`);

         return response?.data?.windFarm;
       },
     });
  
  
  if (isLoading) {
      return (<h1>Loading ...</h1>)
  }

  
const history = windFarm?.productionHistory?.map(
  ({ production, time }, index) => {
    // Accessing profit safely
    const profit = windFarm?.profitHistory?.[index]?.profit;

    return { production, time, profit };
  }
);
  
  console.log(history);


  return (
    <div>
      <h1>Wind Farm Details</h1>
      <h2>Name: {windFarm?.name}</h2>
      <h2>
        Coordinates: {windFarm?.location?.x} {windFarm?.location?.y}
      </h2>
      <h2>Current Profit: {windFarm?.currentProfit}</h2>
      <h2>Total Profit: {windFarm?.overallProfit}</h2>
      <h2>History</h2>
      <div>
        <HistoryTable history={history} />
      </div>
    </div>
  );
}

WindFarm.propTypes = {}

export default WindFarm