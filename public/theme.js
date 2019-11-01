let lastTheme = window.localStorage.getItem('theme');

if (!['light', 'dark'].includes(lastTheme)) {
  lastTheme = 'image';
}

if (lastTheme) {
  document.documentElement.className = lastTheme;
}
