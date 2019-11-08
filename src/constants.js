import { AppConfig } from 'blockstack';

function isBrowserExtension() {
  return window.location.protocol === 'chrome-extension:'
  || window.location.protocol === 'moz-extension:';
}

const appConfig = new AppConfig(['store_write', 'publish_data']);
appConfig.manifestPath = '/blockstack-manifest.json';

// Is chrome extension
if (isBrowserExtension()) {
  appConfig.redirectPath = '/ext-auth';
  appConfig.appDomain = 'https://peppertab.com';
}

export { appConfig };
export const OPEN_WEATHER_API_KEY = '4f1d994ef2ba2a3745d3c28ec1c6cbcd';
export const API_URL = process.env.REACT_APP_API_URL;
export const Themes = { light: 'light', dark: 'dark', image: 'image' };
export const LocalStorage = { theme: 'theme', visibility: 'visibility', lastSyncTime: 'last-sync-time' };
