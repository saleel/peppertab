import { Browser } from './constants';


export function addIdentityPermission() {
  // Get permission
  return new Promise((resolve, reject) => {
    Browser.permissions.contains({
      permissions: ['identity'],
      origins: ['*://content.googleapis.com/*'],
    }, (result) => {
      if (result) {
        resolve();
      } else {
        Browser.permissions.request({
          permissions: ['identity'],
          origins: ['*://content.googleapis.com/*'],
        }, (granted) => {
          if (granted) {
            resolve();
          } else {
            reject(new Error('Identity permission is required to authenticate with Google and fetch your calendar data'));
          }
        });
      }
    });
  });
}