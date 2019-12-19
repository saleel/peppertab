(() => {
  const browser = window.browser || window.chrome;

  if (!browser) {
    return;
  }

  browser.webRequest.onBeforeRequest.addListener(({ url }) => {
    const hostedUrl = 'https://peppertab.com/auth';

    if (url.startsWith(hostedUrl)) {
      const extensionUrl = browser.extension.getURL('/index.html');
      const redirectUrl = url.replace(hostedUrl, extensionUrl);

      return { redirectUrl };
    }

    return null;
  },
  { urls: ['*://peppertab.com/*'], types: ['main_frame'] },
  ['blocking']);

  browser.browserAction.onClicked.addListener(() => {
    const extensionUrl = browser.extension.getURL('/index.html');
    browser.tabs.create({ url: extensionUrl });
  });
})();
