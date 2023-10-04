import getWeather from '../services/weatherService';
import { useEffect, useState } from 'react';

export default function Weather({ capital, latlng }) {
  const [lat, long] = latlng;
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    getWeather(lat, long).then((data) => setWeather(data.current));
  }, [latlng]);

  return weather ? (
    <div>
      <h1>{`Weather in ${capital}`}</h1>
      <p>{`temperature ${weather.temp} Celcius`}</p>
      {weather.weather ? (
        <img
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt={weather.weather[0].description}
        />
      ) : (
        'Fetching weather'
      )}
      <p>{`wind ${weather.wind_speed} m/s`}</p>
    </div>
  ) : (
    'Fetching weather'
  );
}
