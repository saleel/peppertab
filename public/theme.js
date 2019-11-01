const lastTheme = window.localStorage.getItem('theme') || 'bg';
if (lastTheme) {
  document.documentElement.className = lastTheme;
}
