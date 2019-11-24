import React from 'react';
import usePromise from '../../hooks/use-promise';
import StoreContext from '../../contexts/store-context';
import './weather.scss';
import { CacheKeys } from '../../constants';


function Weather() {
  const { generalStore } = React.useContext(StoreContext);

  const isWeatherEnabled = generalStore.isWeatherEnabled();

  const [tryWeather, setTryWeather] = React.useState();


  const [weatherInfo] = usePromise(
    () => generalStore.getWeatherInfo(),
    {
      conditions: [isWeatherEnabled || tryWeather],
      dependencies: [isWeatherEnabled, tryWeather],
      cacheKey: CacheKeys.weather,
      cachePeriodInSecs: (10 * 60),
    },
  );


  React.useEffect(() => {
    if (isWeatherEnabled) return;
    if (!navigator.permissions) return;

    navigator.permissions.query({ name: 'geolocation' }).then((permission) => {
      if (permission.state === 'granted') {
        generalStore.setWeatherEnabled(true);
        setTryWeather(true);
      }
    });
  }, [generalStore, isWeatherEnabled]);


  function onEnableClick() {
    setTryWeather(true);
  }


  if (!isWeatherEnabled && !tryWeather) {
    return (
      <button
        type="button"
        className="weather__enable"
        onClick={onEnableClick}
      >
        Enable Weather
      </button>
    );
  }


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
