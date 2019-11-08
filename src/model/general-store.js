// @ts-check
import { differenceInHours, differenceInMinutes } from 'date-fns';
import { differenceInSeconds } from 'date-fns/esm';
import set from 'lodash/set';
import {
  OPEN_WEATHER_API_KEY, LocalStorage, Themes, API_URL,
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
 * @property imageUrl {string}
 * @property base64 {string}
 * @property color {string}
 * @property height {string}
 * @property width {string}
 * @property user {string}
 * @property location {string}
 * @property link {string}
*/


const DbKeys = {
  profile: 'profile',
  theme: 'theme',
  quote: 'quote',
  weather: 'weather',
  background: 'background',
  events: 'events',
};


class GeneralStore extends Store {
  constructor() {
    super('general');
  }


  /**
   * @param {string} key
   * @param {any} value
   */
  setSettings(key, value) {
    const existing = this.getSettings();
    set(existing, key, value);
    window.localStorage.setItem(LocalStorage.visibility, JSON.stringify(existing));
  }


  /**
   * @return {{ widgets: Boolean }} time
   */
  getSettings() {
    let visibility = {};
    const visibilityStr = window.localStorage.getItem(LocalStorage.visibility);

    if (visibilityStr) {
      try {
        visibility = JSON.parse(visibilityStr);
      } catch (e) {
        // Ignore
      }
    }

    // @ts-ignore
    return visibility;
  }


  /**
   * @param {Date} time
   */
  setLastSyncTime(time) {
    window.localStorage.setItem(LocalStorage.lastSyncTime, time.getTime().toString());
  }


  /**
   * @return {Date} time
   */
  getLastSyncTime() {
    const time = window.localStorage.getItem(LocalStorage.lastSyncTime);

    if (Number.isNaN(Number(time))) {
      return null;
    }

    return new Date(Number(time));
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
    // if (theme !== Themes.image) {
    //   return null;
    // }

    let storedBg;
    try {
      storedBg = await this.db.get(DbKeys.background);
    } catch (error) {
      // Ignore
    }

    // If downloaded image is recent, then no need to download new
    if (storedBg && differenceInSeconds(new Date(), new Date(storedBg.createdAt)) < 10) {
      return storedBg;
    }


    // Fetch a new image and set to local store for next call
    // const url = `https://api.unsplash.com/photos/random?client_id=${UNSPLASH_API_KEY}&collections=8862978&orientation=landscape`;
    const url = `${API_URL}/background`;

    const fetchNewPromise = fetch(url, {
      method: 'GET',
      mode: 'cors',
    })
      .then((r) => r.json())
      .then(async (response) => {
        const base64 = await convertImageUrlToBase64(response.imageUrl);

        const newBackground = { ...response, base64 };

        this.updateItem({ _id: DbKeys.background, ...newBackground, createdAt: new Date() });

        return newBackground;
      })
      .catch((e) => {
        console.error(e); // eslint-disable-line no-console
      });


    // For initial request if the item not found in cache
    if (!storedBg) {
      storedBg = await fetchNewPromise;
    }

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

    const fetchNewPromise = fetch(url, {
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
          city,
          temperature,
          humidity,
          sky,
          createdAt: new Date(),
        };

        // Store to db
        await this.updateItem({ _id: DbKeys.weather, ...weatherInfo });

        return weatherInfo;
      })
      .catch((e) => {
        console.error(e); // eslint-disable-line no-console
      });

    // For initial request if the item not found in cache
    if (!storedWeather) {
      storedWeather = await fetchNewPromise;
    }

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

    const fetchNewPromise = fetch(url, {
      method: 'GET',
      mode: 'cors',
    })
      .then((r) => r.json())
      .then(async (result) => {
        const { contents: { quotes: [quoteRaw] = [] } = {} } = result;
        const { quote: message, author } = quoteRaw;

        const quote = {
          message,
          author,
          createdAt: new Date(),
        };

        await this.updateItem({ _id: DbKeys.quote, ...quote });

        return quote;
      })
      .catch((e) => {
        console.error(e); // eslint-disable-line no-console
      });

    // For initial request if the item not found in cache
    if (!storedQuote) {
      storedQuote = await fetchNewPromise;
    }

    return storedQuote;
  }


  /**
   * @return {Promise<Array>} events
   */
  async getEvents() {
    // let storedEvents;
    // try {
    //   storedEvents = await this.db.get(DbKeys.events);
    // } catch (error) {
    //   // Ignore
    // }

    // // If downloaded image is recent, then no need to download new
    // if (storedEvents && differenceInSeconds(new Date(), new Date(storedEvents.createdAt)) < 10) {
    //   return storedEvents.items;
    // }


    const { gapi } = window;

    const fetchEvents = () => new Promise((resolve, reject) => {
      if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
        gapi.client.calendar.events.list({
          calendarId: 'primary',
          timeMin: (new Date()).toISOString(),
          showDeleted: false,
          singleEvents: true,
          maxResults: 10,
          orderBy: 'startTime',
        }).then(async (response) => {
          const { items } = response.result;
          resolve(items);
        });
      }
    });


    return new Promise((resolve, reject) => {
      gapi.load('client:auth2', () => {
        gapi.client.init({
          apiKey: 'AIzaSyBOXuQDGtvOto1RIJpR7ab6aJ4Jk7s7PpM',
          clientId: '492631281745-ukpj3nrml396bot57q9ikrhd9d46b8qm.apps.googleusercontent.com',
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
          scope: 'https://www.googleapis.com/auth/calendar.readonly',
        }).then(async () => {
          if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
            resolve();
          }

          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(fetchEvents);

          // Handle the initial sign-in state.
          const events = await fetchEvents();
          resolve(events);
        }, (error) => {
          console.error(JSON.stringify(error, null, 2));
        });
      });
    });
  }
}


export default GeneralStore;
