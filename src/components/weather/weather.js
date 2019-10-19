import React from 'react';
import { usePosition } from 'use-position';
import './weather.scss';
import useStore from '../../hooks/use-store';
import StoreContext from '../../contexts/store-context';


function Weather() {
  const { generalStore } = React.useContext(StoreContext);

  const { latitude, longitude } = usePosition();

  const [weatherInfo] = useStore(
    () => generalStore.getWeatherInfo({ latitude, longitude }),
    undefined,
    [latitude],
  );

  if (!weatherInfo) return null;

  const {
    city, temperature, sky,
  } = weatherInfo;


  return (
    <div className="weather">

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
