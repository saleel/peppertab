import React from 'react';
import { usePosition } from 'use-position';
import usePromise from '../../hooks/use-promise';
import StoreContext from '../../contexts/store-context';
import './weather.scss';


function Weather() {
  const { generalStore } = React.useContext(StoreContext);

  const { latitude, longitude } = usePosition();

  const [weatherInfo] = usePromise(
    () => generalStore.getWeatherInfo({ latitude, longitude }),
    { cacheKey: 'WEATHER', dependencies: [latitude, longitude], cachePeriodInSecs: (60 * 60) },
  );


  if (!weatherInfo) return null;

  const {
    city, temperature, sky,
  } = weatherInfo;


  return (
    <div className="weather fade-in">

      <span className="weather__temperature">
        {temperature.toFixed(1)}
        {'°C '}
        {sky}
      </span>

      <span className="weather__city">
        {city}
      </span>

    </div>
  );
}


export default Weather;
