export const getTheme = () => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

export function setTheme(theme: 'light' | 'dark') {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem('theme', theme);
  } catch {}
  window.dispatchEvent(new CustomEvent('themechange', { detail: theme }));
}

export const toggleTheme = () => setTheme(getTheme() === 'dark' ? 'light' : 'dark');
