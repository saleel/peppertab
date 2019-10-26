(() => {
  const { chrome } = window;

  if (!chrome) {
    return;
  }

  chrome.webRequest.onBeforeRequest.addListener(({ url }) => {
    const hostedUrl = 'https://app.peppertab.com/chrome.js';

    if (!url.startsWith(hostedUrl)) {
      const extensionUrl = chrome.extension.getURL('/index.html');
      const redirectUrl = url.replace(hostedUrl, extensionUrl);

      return { redirectUrl };
    }
  },
  { urls: ['*://*.peppertab.com/*'], types: ['main_frame'] },
  ['blocking']);
})();
