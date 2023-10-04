import axios from 'axios';

const baseURL = 'https://api.openweathermap.org/data/3.0/onecall?';
const api_key = process.env.REACT_APP_API_KEY;

const getWeather = (lat, lon) => {
  const request = axios.get(
    `${baseURL}lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`
  );
  return request.then((response) => response.data);
};

export default getWeather;
