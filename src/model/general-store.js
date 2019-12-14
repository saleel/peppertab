// @ts-check

import {
  OPEN_WEATHER_API_KEY, LocalStorage, Themes, API_URL, Browser, isWebApp, GOOGLE_CLIENT_ID, GOOGLE_API_KEY, isBrowserExtension,
} from '../constants';
import Store from './store';
import { convertImageUrlToBase64, getLinkFromUrl } from './utils';
import { addIdentityPermission, addTopSitesPermission } from '../browser-permissions';
import { loadScript } from '../utils';


/**
 * @typedef CalendarEvent
 * @property title {string}
 * @property link {string}
 * @property startDateTime {Date}
 * @property startDate {Date}
 * @property endDateTime {Date}
 * @property endDate {Date}
 * @property location {string}
 */


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
  settings: 'settings',
};


// @ts-ignore


class GeneralStore extends Store {
  constructor() {
    super('general');
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

    if (!time || Number.isNaN(Number(time))) {
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
    const { imageUrl } = jsonResponse;

    const requiredWidth = Math.max(1920, window.innerWidth * 1.25);
    const imageUrlWithWidth = `${imageUrl}&w=${requiredWidth}`;

    const base64 = await convertImageUrlToBase64(imageUrlWithWidth);

    const newBackground = { ...jsonResponse, base64, imageUrl: imageUrlWithWidth };

    return newBackground;
  }

  isWeatherEnabled() {
    return localStorage.getItem('weather.enabled') === 'true';
  }

  /** @param {Boolean} value */
  setWeatherEnabled(value) {
    localStorage.setItem('weather.enabled', value.toString());
  }


  /**
   * @return {Promise<WeatherInfo|boolean>} Weather Data for give lat long
   */
  async getWeatherInfo() {
    const { latitude, longitude } = await new Promise((resolve, reject) => {
      try {
        navigator.geolocation.getCurrentPosition((pos) => {
          resolve(pos.coords);
        });
      } catch (e) {
        reject(e);
      }
    });


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

    this.setWeatherEnabled(true);

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


  isCalendarEnabled() {
    return localStorage.getItem('calendar.enabled') === 'true';
  }

  /** @param {Boolean} value */
  setCalendarEnabled(value) {
    localStorage.setItem('calendar.enabled', value.toString());
  }


  /**
   * @return {Promise<CalendarEvent[]>} events
   */
  async getEvents() {
    const clientId = GOOGLE_CLIENT_ID;
    const apiKey = GOOGLE_API_KEY;
    const scope = 'https://www.googleapis.com/auth/calendar.readonly';
    let token;

    if (!this.isCalendarEnabled() && isBrowserExtension) {
      await addIdentityPermission();
    }

    try {
      token = await new Promise((resolve, reject) => {
        if (isWebApp) {
          let gapi;

          const onSignIn = () => {
            if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
              const accessToken = gapi.auth2.getAuthInstance()
                .currentUser.get().getAuthResponse().access_token;
              resolve(accessToken);
            }
          };

          loadScript('https://apis.google.com/js/api.js').then(() => {
            // @ts-ignore
            gapi = window.gapi;

            gapi.load('client:auth2', () => {
              gapi.client.init({
                clientId,
                scope,
                apiKey,
              }).then(() => {
                if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
                  gapi.auth2.getAuthInstance().signIn()
                    .then(onSignIn)
                    .catch(reject);
                }

                gapi.auth2.getAuthInstance().isSignedIn.listen(onSignIn);

                onSignIn();
              }, (error) => {
                reject(error);
              });
            });
          });
        } else {
          let redirectURL = Browser.identity.getRedirectURL();
          redirectURL = redirectURL.endsWith('/') ? redirectURL.slice(0, -1) : redirectURL;

          let authURL = 'https://accounts.google.com/o/oauth2/auth';
          authURL += `?client_id=${clientId}`;
          authURL += '&response_type=token';
          authURL += `&redirect_uri=${encodeURIComponent(redirectURL)}`;
          authURL += `&scope=${encodeURIComponent(scope)}`;

          Browser.identity.launchWebAuthFlow({
            interactive: !this.isCalendarEnabled(), // Interactive for the first time
            url: authURL,
          }, (returnUrl) => {
            if (returnUrl) {
              const accessToken = returnUrl.split('access_token=')[1].split('&')[0];
              resolve(accessToken);
            } else {
              reject(new Error('Cannot get access token'));
            }
          });
        }
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      this.setCalendarEnabled(false);
      throw e;
    }

    if (!token || !token.length) {
      this.setCalendarEnabled(false);
    }


    const query = {
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 4,
      orderBy: 'startTime',
      key: apiKey,
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

    this.setCalendarEnabled(true);

    return events;
  }


  isTopSitesEnabled() {
    if (!isBrowserExtension) return false;

    return localStorage.getItem('topSites.enabled') === 'true';
  }

  /** @param {Boolean} value */
  setTopSitesEnabled(value) {
    localStorage.setItem('topSites.enabled', value.toString());
  }


  /**
   * @return {Promise<Link[]>} Weather Data for give lat long
   */
  async findTopSites({ limit }) {
    if (!this.isTopSitesEnabled()) {
      await addTopSitesPermission();
    }

    const topSites = await new Promise((resolve, reject) => {
      if (Browser && Browser.topSites) {
        Browser.topSites.get((sites) => {
          const links = sites
            .slice(0, limit)
            .map((site) => getLinkFromUrl(site.url));

          resolve(links);
        });
      } else {
        reject(new Error('Cannot access browser top sites'));
      }
    });

    this.setTopSitesEnabled(true);

    return topSites;
  }
}


export default GeneralStore;
