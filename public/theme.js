const lastTheme = window.localStorage.getItem('theme') || 'image';
if (lastTheme) {
  document.documentElement.className = lastTheme;
}
