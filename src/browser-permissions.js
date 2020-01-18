import {
  Browser, isChromeExtension, isFirefoxExtension, isBrowserExtension,
} from './constants';


function addPermission(permissionsToAdd) {
  return new Promise((resolve, reject) => {
    if (!isBrowserExtension) {
      reject(new Error('Top Sites can work only in Browser Extension'));
    }

    if (isChromeExtension) {
      Browser.permissions.contains(permissionsToAdd, (contains) => {
        if (contains) {
          resolve();
        } else {
          Browser.permissions.request(permissionsToAdd, (granted) => {
            if (granted) resolve();
            else reject(new Error('Permission Declined'));
          });
        }
      });
    }

    if (isFirefoxExtension) {
      Browser.permissions.request(permissionsToAdd)
        .then((granted) => {
          if (granted) resolve();
          else reject(new Error('Permission Declined'));
        })
        .catch(reject);
    }
  });
}


export async function addIdentityPermission() {
  try {
    return addPermission({
      // permissions: ['identity'],
      origins: ['*://content.googleapis.com/*'],
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    throw error;
  }
}


export async function addTopSitesPermission() {
  try {
    await addPermission({
      permissions: ['topSites'],
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    throw error;
  }
}
