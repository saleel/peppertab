import { AppConfig } from 'blockstack';

const appConfig = new AppConfig(['store_write', 'publish_data']);
appConfig.appDomain = 'https://app.peppertab.com';
appConfig.manifestPath = '/blockstack-manifest.json';
// appConfig.manifestURI = () => 'https://app.peppertab.com/blockstack-manifest.json';


export { appConfig };
export const OPEN_WEATHER_API_KEY = '4f1d994ef2ba2a3745d3c28ec1c6cbcd';
