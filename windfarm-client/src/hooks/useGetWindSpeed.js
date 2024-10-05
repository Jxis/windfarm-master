import axios from 'axios';

const useGetWindSpeed = () => {
    async function fetchWindSpeedData({lat, lng, start, end}) {
      const params = {
        lat,
        lng,
        params: "windSpeed",
        start,
        end,
      };
        
        console.log("HI!");
console.log(process.env.REACT_APP_BASE_URL);
        console.log(process.env.REACT_APP_WIND_API_ENDPOINT);
        console.log(process.env.REACT_APP_WIND_API_KEY);

      const response = await axios.get(
        process.env.REACT_APP_WIND_API_ENDPOINT,
        {
          params: params,
          headers: { Authorization: process.env.REACT_APP_WIND_API_KEY },
        }
      );
        
        console.log(response);
        
        console.log(response);

      return response.data.hours;
    }

    return {fetchWindSpeedData}
}

export default useGetWindSpeed