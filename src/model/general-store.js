// @ts-check

import addDays from 'date-fns/addDays';
import {
  OPEN_WEATHER_API_KEY, API_URL, Browser, isWebApp, GOOGLE_CLIENT_ID, GOOGLE_API_KEY,
} from '../constants';
import Store from './store';
import { convertImageUrlToBase64, getLinkFromUrl } from './utils';
// import { addIdentityPermission } from '../browser-permissions';
import { loadScript } from '../utils';
import { GoogleAuthError } from '../errors';


/**
 * @typedef CalendarEvent
 * @property id {string}
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
 * @property userUrl {string}
 * @property source {string}
 * @property sourceUrl {string}
 * @property location {string}
 * @property link {string}
*/


class GeneralStore extends Store {
  constructor() {
    super('general');
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

    return weatherInfo;
  }


  /**
   * @return {Promise<Quote>} Quote of the day
   */
  async getQuote({ percentOfDayRemaining }) {
    const url = `${API_URL}/quote?percentOfDayRemaining=${percentOfDayRemaining}`;

    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
    });
    const quote = await response.json();

    return quote;
  }


  /**
   * @return {Promise<CalendarEvent[]>} events
   */
  async getEvents({ isFirstTime }) {
    const clientId = GOOGLE_CLIENT_ID;
    const apiKey = GOOGLE_API_KEY;
    const scope = 'https://www.googleapis.com/auth/calendar.readonly';
    let token;

    // if (isFirstTime && isBrowserExtension) {
    //   await addIdentityPermission();
    // }

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

          loadScript('gapi.js').then(() => {
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
                reject(new GoogleAuthError(error.message));
              });
            });
          })
            .catch((e) => reject(e));
        } else {
          let redirectURL = Browser.identity.getRedirectURL();
          redirectURL = redirectURL.endsWith('/') ? redirectURL.slice(0, -1) : redirectURL;
          let authURL = 'https://accounts.google.com/o/oauth2/auth';
          authURL += `?client_id=${clientId}`;
          authURL += '&response_type=token';
          authURL += `&redirect_uri=${encodeURIComponent(redirectURL)}`;
          authURL += `&scope=${encodeURIComponent(scope)}`;

          Browser.identity.launchWebAuthFlow({
            interactive: isFirstTime, // Interactive for the first time
            url: authURL,
          }, (returnUrl) => {
            if (returnUrl) {
              const accessToken = returnUrl.split('access_token=')[1].split('&')[0];
              resolve(accessToken);
            } else {
              reject(new GoogleAuthError('Cannot get access token'));
            }
          });
        }
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      throw e;
    }

    const getCalendarRequest = await fetch('https://content.googleapis.com/calendar/v3/users/me/calendarList', {
      method: 'GET',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const getCalendarResponse = await getCalendarRequest.json();
    const calendarsToFetch = getCalendarResponse.items
      .filter((item) => !item.summary.includes('Holidays'));

    const calendarEvents = [];

    for (const calendarToFetch of calendarsToFetch) {
      const query = {
        calendarId: calendarToFetch.id,
        timeMin: (new Date()).toISOString(),
        timeMax: (addDays(new Date(), 30)).toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: 'startTime',
        key: apiKey,
      };

      const queryParam = Object.keys(query)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
        .join('&');

      const url = `https://content.googleapis.com/calendar/v3/calendars/primary/events?${queryParam}`;

      // eslint-disable-next-line no-await-in-loop
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // eslint-disable-next-line no-await-in-loop
      const jsonResponse = await response.json();

      calendarEvents.push(...jsonResponse.items.map((j) => ({ ...j, calendar: calendarToFetch })));
    }

    const enableCalendarColor = calendarsToFetch.length > 1;

    const events = calendarEvents.map((item) => {
      const {
        summary, htmlLink, start, end, location, calendar, id,
      } = item;

      return {
        id,
        title: summary,
        link: htmlLink,
        ...start.dateTime && { startDateTime: new Date(start.dateTime) },
        ...start.date && { startDate: new Date(start.date) },
        ...end.dateTime && { endDateTime: new Date(end.dateTime) },
        ...end.date && { endDate: new Date(end.date) },
        location,
        ...enableCalendarColor && {
          calendarName: calendar.summary,
          calendarColor: calendar.backgroundColor,
        },
      };
    });

    return events;
  }


  /**
   * @return {Promise<import('./link').default[]>} Weather Data for give lat long
   */
  async findTopSites({ limit }) {
    const topSites = await new Promise((resolve, reject) => {
      if (Browser && Browser.topSites) {
        Browser.topSites.get((sites) => {
          const links = sites
            .slice(0, limit)
            .map((site) => getLinkFromUrl(site.url));

          Promise.all(links)
            .then(resolve)
            .catch(reject);
        });
      } else {
        reject(new Error('Cannot access browser top sites'));
      }
    });

    return topSites;
  }
}


export default GeneralStore;
