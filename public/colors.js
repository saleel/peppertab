(() => {
  const colors = [
    '#fdbf9c',
    '#FFBD9F',
    '#e9a8f3',
    '#85a6d8',
    '#ff8696',
    '#ff7b7b',
    '#94A7ED',
    '#5ac7a2',
    '#60866c',
    '#B6A1DE',
    '#ba88f9',
    '#ff6161',
  ];

  const hour = new Date().getHours();
  const color = colors[hour % 12];

  if (color && document.documentElement) {
    document.documentElement.style.setProperty('--main-bg-color', color);
  }
})();
