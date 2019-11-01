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


export { convertImageUrlToBase64 };
