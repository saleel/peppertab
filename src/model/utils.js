import Link from './link';

function convertImageUrlToBase64(url) {
  return new Promise((resolve) => {
    const tempImage = new Image();
    tempImage.crossOrigin = 'Anonymous';

    tempImage.onload = function onImageLoad() {
      const canvas = document.createElement('CANVAS');
      const ctx = canvas.getContext('2d');

      canvas.height = this.naturalHeight;
      canvas.width = this.naturalWidth;
      ctx.drawImage(this, 0, 0);

      const dataURL = canvas.toDataURL('image/jpeg');

      resolve(dataURL);
    };

    tempImage.src = url;
    if (tempImage.complete || tempImage.complete === undefined) {
      tempImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
      tempImage.src = url;
    }
  });
}


function isIP(address) {
  const r = RegExp('^http[s]?://((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])');
  return r.test(address);
}


function getLinkFromUrl(url) {
  if (!url) {
    return null;
  }

  let hostname;

  try {
    ({ hostname } = new URL(url));
  } catch (e) {
    // eslint-disable-next-line no-alert
    return null;
  }

  const hostNamePortions = hostname.split('.');
  let siteName = hostNamePortions[hostNamePortions.length - 2];

  if (isIP(url) || hostname === 'localhost') {
    siteName = hostname;
  }

  return new Link({
    siteName, hostname, url,
  });
}


export { convertImageUrlToBase64, getLinkFromUrl };
