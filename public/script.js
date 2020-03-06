function updateColors() {
  const colorMode = JSON.parse(window.localStorage.getItem('settings.colorMode') || '');

  if (colorMode === 'light') {
    document.documentElement.style.setProperty('--bg-color', 'rgb(240, 240, 240)');
    document.documentElement.style.setProperty('--bg-color-2', 'rgb(210, 210, 210)');
    document.documentElement.style.setProperty('--bg-color-3', 'rgb(215, 215, 215)');
    document.documentElement.style.setProperty('--bg-color-4', 'rgb(225, 225, 225)');
    document.documentElement.style.setProperty('--bg-color-5', 'rgb(230, 230, 230)');
    document.documentElement.style.setProperty('--bg-color-6', 'rgb(235, 235, 235)');

    document.documentElement.style.setProperty('--text-color', '#021E2D');
    document.documentElement.style.setProperty('--text-color-2', 'rgba(0, 0, 0, 0.9)');
    document.documentElement.style.setProperty('--text-color-3', 'rgba(0, 0, 0, 0.75)');
    document.documentElement.style.setProperty('--text-color-4', 'rgba(0, 0, 0, 0.65)');
    document.documentElement.style.setProperty('--text-color-5', 'rgba(0, 0, 0, 0.5)');
    document.documentElement.style.setProperty('--text-color-6', 'rgba(0, 0, 0, 0.5)');

    document.documentElement.style.setProperty('--color-primary', '#2980b9');
    document.documentElement.style.setProperty('--color-warning', '#e67e22');
    document.documentElement.style.setProperty('--color-success', '#074b23');
    document.documentElement.style.setProperty('--color-danger', '#e74c3c');
  } else {
    document.documentElement.style.setProperty('--bg-color', 'rgb(47, 48, 50');
    document.documentElement.style.setProperty('--bg-color-2', 'rgb(31, 31, 31');
    document.documentElement.style.setProperty('--bg-color-3', 'rgb(36, 36, 36');
    document.documentElement.style.setProperty('--bg-color-4', 'rgb(38, 38, 38');
    document.documentElement.style.setProperty('--bg-color-5', 'rgb(41, 41, 41');
    document.documentElement.style.setProperty('--bg-color-6', 'rgb(43, 43, 43');

    document.documentElement.style.setProperty('--text-color', '#fff');
    document.documentElement.style.setProperty('--text-color-2', 'rgba(255, 255, 255, 0.9');
    document.documentElement.style.setProperty('--text-color-3', 'rgba(255, 255, 255, 0.75');
    document.documentElement.style.setProperty('--text-color-4', 'rgba(255, 255, 255, 0.65');
    document.documentElement.style.setProperty('--text-color-5', 'rgba(255, 255, 255, 0.5');
    document.documentElement.style.setProperty('--text-color-6', 'rgba(255, 255, 255, 0.5');

    document.documentElement.style.setProperty('--color-primary', '#2980b9');
    document.documentElement.style.setProperty('--color-warning', '#e67e22');
    document.documentElement.style.setProperty('--color-success', '#2ecc71');
    document.documentElement.style.setProperty('--color-danger', '#e74c3c');
  }
}

window.updateColors = updateColors;
window.updateColors();
