import { AppConfig } from 'blockstack';


export const API_URL = process.env.REACT_APP_API_URL;


export const OPEN_WEATHER_API_KEY = '4f1d994ef2ba2a3745d3c28ec1c6cbcd';
export const GOOGLE_CLIENT_ID = '492631281745-ukpj3nrml396bot57q9ikrhd9d46b8qm.apps.googleusercontent.com';
export const GOOGLE_API_KEY = 'AIzaSyBOXuQDGtvOto1RIJpR7ab6aJ4Jk7s7PpM';


export const Themes = { inspire: 'inspire', focus: 'focus' };
export const LocalStorage = { theme: 'theme', visibility: 'visibility', lastSyncTime: 'last-sync-time' };
export const CacheKeys = { calendar: 'calendar', background: 'background', weather: 'weather' };


export const Browser = window.browser || window.chrome;
export const isBrowserExtension = ['chrome-extension:', 'moz-extension:'].includes(window.location.protocol);
export const isWebApp = !isBrowserExtension;


export const BlockstackAppConfig = new AppConfig(
  ['store_write', 'publish_data'],
  'https://peppertab.com',
  `/auth?origin=${window.location.origin}/`,
  '/blockstack-manifest.json',
);
