// @ts-check
import { differenceInHours, differenceInMinutes } from 'date-fns';
import {
  OPEN_WEATHER_API_KEY, LocalStorage, Themes, UNSPLASH_API_KEY,
} from '../constants';
import Store from './store';
import { convertImageUrlToBase64 } from './utils';


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


/**
 * @typedef Background
 * @property base64 {string}
*/


const DbKeys = {
  profile: 'profile',
  theme: 'theme',
  quote: 'quote',
  weather: 'weather',
  background: 'background',
};


class GeneralStore extends Store {
  constructor() {
    super('general');
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
   * @param {{ name: string }} time
   */
  setProfile({ name }) {
    return this.updateItem({ _id: DbKeys.profile, name });
  }


  /**
   * @return {Promise<{ name: string }>} time
   */
  getProfile() {
    return this.db.get(DbKeys.profile);
  }


  /**
   * @return {Promise<string>} theme
   */
  async getTheme() {
    return window.localStorage.getItem(LocalStorage.theme);
  }


  /**
   * @param {string} theme
   */
  async setTheme(theme) {
    window.localStorage.setItem(LocalStorage.theme, theme);
    this.emitter.emit('theme-updated');
  }


  /**
   * @return {Promise<Background>} theme
   */
  async getBackground() {
    const theme = await this.getTheme();
    if (theme !== Themes.image) {
      return null;
    }

    let storedBg;
    try {
      storedBg = await this.db.get(DbKeys.background);
    } catch (error) {
      // Ignore
    }

    // If downloaded image is recent, then no need to download new
    if (storedBg && differenceInHours(new Date(), new Date(storedBg.createdAt)) < 1) {
      return storedBg;
    }


    // Fetch a new image and set to local store for next call
    const url = `https://api.unsplash.com/photos/random?client_id=${UNSPLASH_API_KEY}&collections=317099&orientation=landscape`;

    fetch(url, {
      method: 'GET',
      mode: 'cors',
    })
      .then((r) => r.json())
      .then(async (result) => {
        const {
          urls: { regular: imageUrl }, color, height, width,
        } = result;

        const base64 = await convertImageUrlToBase64(imageUrl);

        const background = {
          imageUrl,
          base64,
          color,
          height,
          width,
          createdAt: new Date(),
        };

        this.updateItem({ _id: DbKeys.background, ...background });
      })
      .catch((e) => {
        console.error(e); // eslint-disable-line no-console
      });

    return storedBg;
  }


  /**
   * @param {{latitude: number, longitude: number}} params Lat/Long
   * @return {Promise<WeatherInfo>} Weather Data for give lat long
   */
  async getWeatherInfo({ latitude, longitude }) {
    let storedWeather;
    try {
      storedWeather = await this.db.get(DbKeys.weather);
    } catch (e) {
      // Ignore
    }

    // If downloaded weather is recent, then no need to download new
    if (storedWeather && differenceInMinutes(new Date(), new Date(storedWeather.createdAt)) < 60) {
      return storedWeather;
    }

    if (!latitude || !longitude) {
      return storedWeather;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPEN_WEATHER_API_KEY}`;

    fetch(url, {
      method: 'GET',
      mode: 'cors',
    })
      .then((r) => r.json())
      .then(async (result) => {
        const {
          name: city,
          main: { temp, humidity },
          weather: [{ main: sky }],
        } = result;

        const temperature = temp - 273.15; // Convert Kelvin to Celsius
        const weatherInfo = {
          city, temperature, humidity, sky,
        };

        // Store to db
        await this.updateItem({ _id: DbKeys.weather, ...weatherInfo, createdAt: new Date() });
      })
      .catch((e) => {
        console.error(e); // eslint-disable-line no-console
      });

    return storedWeather;
  }


  /**
   * @return {Promise<Quote>} Quote of the day
   */
  async getQuote() {
    let storedQuote;
    try {
      storedQuote = await this.db.get(DbKeys.quote);
    } catch (e) {
      // Ignore
    }

    // If downloaded quote is recent, then no need to download new
    if (storedQuote && differenceInHours(new Date(), new Date(storedQuote.createdAt)) < 6) {
      return storedQuote;
    }

    const url = 'https://quotes.rest/qod?category=inspire';

    fetch(url, {
      method: 'GET',
      mode: 'cors',
    })
      .then((r) => r.json())
      .then(async (result) => {
        const { contents: { quotes: [quoteRaw] = [] } = {} } = result;
        const { quote: message, author } = quoteRaw;

        const quote = { message, author };

        await this.updateItem({ _id: DbKeys.quote, ...quote, createdAt: new Date() });
      })
      .catch((e) => {
        console.error(e); // eslint-disable-line no-console
      });

    return storedQuote;
  }
}


export default GeneralStore;
