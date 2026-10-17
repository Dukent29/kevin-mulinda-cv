// Runs before CSS/first paint; storage can be disabled in private contexts.
(() => {
  const params = new URLSearchParams(location.search);
  try {
    const requested = params.get('theme');
    const theme = requested || localStorage.getItem('cv-theme');
    document.documentElement.dataset.theme = theme === 'dark' || (!theme && matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  } catch { document.documentElement.dataset.theme = 'light'; }
  const lang = params.get('lang');
  if ((lang === 'en' || lang === 'fr') && document.documentElement.lang !== lang) {
    const url = new URL(lang === 'en' ? 'en.html' : 'index.html', location.href);
    url.search = location.search;
    location.replace(url);
  }
})();
