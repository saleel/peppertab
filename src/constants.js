import { AppConfig } from 'blockstack';

const appConfig = new AppConfig(['store_write', 'publish_data']);
appConfig.manifestPath = '/blockstacks-manifest.json';
appConfig.appDomain = 'https://f3bc0b19.ngrok.io';

export { appConfig };
export const OPEN_WEATHER_API_KEY = '4f1d994ef2ba2a3745d3c28ec1c6cbcd';
