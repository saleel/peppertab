// @ts-check

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
    const theme = window.localStorage.getItem(LocalStorage.theme);

    if (!Object.keys(Themes).includes(theme)) {
      window.localStorage.setItem(LocalStorage.theme, Themes.inspire);
      return Themes.inspire;
    }

    return theme;
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
    const url = `${API_URL}/background`;

    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
    });

    const jsonResponse = await response.json();
    const base64 = await convertImageUrlToBase64(jsonResponse.imageUrl);

    const newBackground = { ...jsonResponse, base64 };

    return newBackground;
  }


  /**
   * @param {{latitude: number, longitude: number}} params Lat/Long
   * @return {Promise<WeatherInfo>} Weather Data for give lat long
   */
  async getWeatherInfo({ latitude, longitude }) {
    if (!latitude || !longitude) return null;

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPEN_WEATHER_API_KEY}`;

    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
    });
    const jsonResponse = await response.json();

    const {
      name: city,
      main: { temp, humidity },
      weather: [{ main: sky }],
    } = jsonResponse;

    const temperature = temp - 273.15; // Convert Kelvin to Celsius

    const weatherInfo = {
      city,
      temperature,
      humidity,
      sky,
      createdAt: new Date(),
    };

    return weatherInfo;
  }


  /**
   * @return {Promise<Quote>} Quote of the day
   */
  async getQuote() {
    const url = 'https://quotes.rest/qod?category=inspire';

    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
    });
    const jsonResponse = await response.json();
    const { contents: { quotes: [quoteRaw] = [] } = {} } = jsonResponse;
    const { quote: message, author } = quoteRaw;

    const quote = {
      message,
      author,
      createdAt: new Date(),
    };

    return quote;
  }


  /**
   * @return {Promise<Array>} events
   */
  async getEvents(token) {
    const query = {
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 4,
      orderBy: 'startTime',
      key: 'AIzaSyBOXuQDGtvOto1RIJpR7ab6aJ4Jk7s7PpM',
    };

    const queryParam = Object.keys(query)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
      .join('&');

    const url = `https://content.googleapis.com/calendar/v3/calendars/primary/events?${queryParam}`;

    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const jsonResponse = await response.json();

    const events = jsonResponse.items.map((item) => {
      const {
        summary, htmlLink, start, end, location,
      } = item;

      return {
        title: summary,
        link: htmlLink,
        ...start.dateTime && { startDateTime: new Date(start.dateTime) },
        ...start.date && { startDate: new Date(start.date) },
        ...end.dateTime && { endDateTime: new Date(end.dateTime) },
        ...end.date && { endDate: new Date(end.date) },
        location,
      };
    });

    return events;
  }
}


export default GeneralStore;
