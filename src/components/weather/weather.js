import React from 'react';
import usePromise from '../../hooks/use-promise';
import StoreContext from '../../contexts/store-context';
import './weather.scss';
import { CacheKeys, isWebApp, SettingKeys } from '../../constants';
import useLocalStorage from '../../hooks/use-local-storage';


function Weather() {
  const { generalStore } = React.useContext(StoreContext);

  const isWeatherEnabled = generalStore.isWeatherEnabled();

  const [tryWeather, setTryWeather] = React.useState();

  const [weatherUnit] = useLocalStorage(SettingKeys.weatherUnit, 'C');


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

    if (isWebApp) {
      navigator.permissions.query({ name: 'geolocation' }).then((permission) => {
        if (permission.state === 'granted') {
          generalStore.setWeatherEnabled(true);
          setTryWeather(true);
        }
      });
    } else {
      setTryWeather(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWeatherEnabled]);


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

  let tempDisplay = temperature;


  if (weatherUnit === 'F') {
    tempDisplay = `${(temperature * (9 / 5)) + 32} °F`;
  } else {
    tempDisplay = `${temperature} °C`;
  }


  return (
    <div className="weather fade-in">

      <span className="weather__temperature">
        {tempDisplay}
        {' '}
        {sky}
      </span>

      <span className="weather__city">
        {city}
      </span>

    </div>
  );
}


export default Weather;
