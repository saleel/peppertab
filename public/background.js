(() => {
  let { browser } = window;

  if (!browser) {
    if (window.chrome) {
      browser = window.chrome;
    } else {
      return;
    }
  }

  browser.webRequest.onBeforeRequest.addListener(({ url }) => {
    const hostedUrl = 'https://app.peppertab.com/ext-auth';

    if (url.startsWith(hostedUrl)) {
      const extensionUrl = browser.extension.getURL('/index.html');
      const redirectUrl = url.replace(hostedUrl, extensionUrl);

      return { redirectUrl };
    }

    return null;
  },
  { urls: ['*://app.peppertab.com/*'], types: ['main_frame'] },
  ['blocking']);
})();
