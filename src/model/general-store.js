// @ts-check
import { differenceInHours } from 'date-fns';
import { OPEN_WEATHER_API_KEY, LocalStorage } from '../constants';
import Store from './store';


/**
 * @typedef WeatherInfo
 * @property city {string}
 * @property temperature {number}
 * @property humidity {number}
 * @property sky {string}
 */


/**
 * @typedef Quote
 * @property message {string}
 * @property author {string}
*/


class GeneralStore extends Store {
  constructor() {
    super('general');
  }


  /**
   * @param {{ name: string }} time
   */
  setProfile({ name }) {
    return this.updateItem({ _id: 'profile', name });
  }


  /**
   * @return {Promise<{ name: string }>} time
   */
  getProfile() {
    return this.db.get('profile');
  }


  /**
   * @param {string} theme
   */
  setTheme(theme) {
    window.localStorage.setItem(LocalStorage.theme, theme);
    this.emitter.emit('change-theme');
  }


  /**
   * @return {string} theme
   */
  getTheme() {
    return window.localStorage.getItem(LocalStorage.theme);
  }


  /**
   * @param {Date} time
   */
  setLastSyncTime(time) {
    window.localStorage.setItem(LocalStorage.lastSyncTime, time.toUTCString());
  }


  /**
   * @return {Date} time
   */
  getLastSyncTime() {
    const time = window.localStorage.getItem(LocalStorage.lastSyncTime);
    if (!time) return null;

    return new Date(time);
  }


  /**
   * @param {{latitude: number, longitude: number}} params Lat/Long
   * @return {Promise<WeatherInfo>} Weather Data for give lat long
   */
  async getWeatherInfo({ latitude, longitude }) {
    const dbId = 'weather';

    // Check if already exists in DB
    try {
      const dbWeatherInfo = await this.db.get(dbId);

      if (dbWeatherInfo) {
        const weatherDate = new Date(dbWeatherInfo.createdAt);
        if (differenceInHours(new Date(), weatherDate) < 1) {
          return dbWeatherInfo;
        }
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

    const temperature = temp - 273.15; // Convert Kelvin to Celsius
    const weatherInfo = {
      city, temperature, humidity, sky,
    };

    // Store to db
    await this.updateItem({ _id: dbId, ...weatherInfo, createdAt: new Date() });

    return weatherInfo;
  }


  /**
   * @return {Promise<Quote>} Weather Data for give lat long
   */
  async getQuote() {
    try {
      const cachedQuote = await this.db.get('qod');

      if (cachedQuote) {
        const qodDate = new Date(cachedQuote.createdAt);

        if (differenceInHours(new Date(), qodDate) < 1) {
          return cachedQuote;
        }
      }
    } catch (e) {
      // Skip
    }


    const url = 'https://quotes.rest/qod?category=inspire';
    const response = await fetch(url);
    const jsonResponse = await response.json();
    const { contents: { quotes: [quoteRaw] = [] } = {} } = jsonResponse;

    if (!quoteRaw) return null;

    const { quote: message, author } = quoteRaw;

    const quote = { message, author };

    await this.updateItem({ _id: 'qod', ...quote, createdAt: new Date() });

    return quote;
  }
}


export default GeneralStore;
