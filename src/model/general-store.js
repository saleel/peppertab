// @ts-check
import PouchDB from 'pouchdb';
import { OPEN_WEATHER_API_KEY } from '../constants';

/**
 * @typedef WeatherData
 * @property city {string}
 * @property temperature {number}
 * @property humidity {number}
 * @property sky {string}
 */


class GeneralStore {
  constructor() {
    this.db = new PouchDB('general');
  }


  /**
   * @param {{ name: string }} time
   */
  setProfile({ name }) {
    return this.db.put({ _id: 'profile', name });
  }


  /**
   * @return {Promise<{ name: string }>} time
   */
  getProfile() {
    return this.db.get('profile');
  }


  /**
   * @param {{latitude: number, longitude: number}} params Lat/Long
   * @return {Promise<WeatherData>} Weather Data for give lat long
   */
  async getWeatherInfo({ latitude, longitude }) {
    const dbId = 'weather';

    // Check if already exists in DB
    try {
      const dbWeatherInfo = await this.db.get(dbId);
      if (dbWeatherInfo) {
        return dbWeatherInfo;
      }
    } catch (e) {
      // Do nothing if not found in DB
    }

    if (!latitude || !longitude) return null;

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPEN_WEATHER_API_KEY}`;
    const response = await fetch(url);
    const jsonResponse = await response.json();

    const {
      name: city,
      main: { temp, humidity },
      weather: [{ main: sky }],
    } = jsonResponse;

    const temperature = temp - 273.15; // Convert Kelvin to Celcius
    const weatherInfo = {
      city, temperature, humidity, sky,
    };

    console.log({ weatherInfo });

    // Store to db
    await this.db.post({ _id: dbId, ...weatherInfo });

    return weatherInfo;
  }


  /**
   * @param {Date} time
   */
  setLastSyncTime(time) {
    window.localStorage.setItem('last-sync-time', time.toUTCString());
  }


  /**
   * @return {Date} time
   */
  getLastSyncTime() {
    const time = window.localStorage.getItem('last-sync-time');
    if (!time) return null;

    return new Date(time);
  }
}


export default GeneralStore;
