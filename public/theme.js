let lastTheme = window.localStorage.getItem('theme');

if (!['light', 'dark', 'image'].includes(lastTheme)) {
  lastTheme = 'image';
  window.localStorage.setItem('theme', 'image');
}

if (lastTheme) {
  document.documentElement.className = lastTheme;
}
