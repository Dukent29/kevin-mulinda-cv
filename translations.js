const themeButton = document.querySelector('.theme-toggle');
function updatePdfLinks() {
  const lang = document.documentElement.lang.toUpperCase();
  const suffix = document.documentElement.dataset.theme === 'dark' ? '_DARK' : '';
  const file = `Kevin_Mulinda_Bruce_CV_${lang}${suffix}.pdf`;
  const download = document.querySelector('#pdf-download');
  download.href = file;
  download.download = file;
  const printLink = document.querySelector('#print-cv');
  if (printLink) printLink.href = file;
}
function updateThemeButton() {
  const dark = document.documentElement.dataset.theme === 'dark';
  const en = document.documentElement.lang === 'en';
  themeButton.textContent = dark ? '☀' : '◐';
  themeButton.setAttribute('aria-label', dark ? (en ? 'Switch to light theme' : 'Activer le thème clair') : (en ? 'Switch to dark theme' : 'Activer le thème sombre'));
  themeButton.setAttribute('aria-pressed', String(dark));
  updatePdfLinks();
}
themeButton.hidden = false;
updateThemeButton();
themeButton.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  const url = new URL(location.href);
  url.searchParams.set('theme', theme);
  history.replaceState(null, '', url);
  try { localStorage.setItem('cv-theme', theme); } catch {}
  updateThemeButton();
});
// Preserve explicit URL theme choices across language changes, including when storage is unavailable.
document.querySelectorAll('.language-switcher a').forEach(link => {
  link.addEventListener('click', () => {
    const url = new URL(link.href);
    url.searchParams.set('theme', document.documentElement.dataset.theme);
    link.href = url;
  });
});
const music = document.querySelector('.music-player');
const audio = music.querySelector('audio');
music.addEventListener('toggle', () => {
  if (music.open) audio.play().catch(() => {});
  else { audio.pause(); audio.currentTime = 0; }
});
audio.addEventListener('ended', () => { music.open = false; });

// Reveal each content block once; unsupported browsers and no-JS keep content visible.
const motion = matchMedia('(prefers-reduced-motion: reduce)');
let revealObserver;
function revealContent() {
  if (motion.matches || !('IntersectionObserver' in window)) return;
  revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.panel, .entry').forEach(element => {
    // Keep above-the-fold text readable immediately; reveal the rest on scroll.
    if (element.getBoundingClientRect().top >= innerHeight - 24) {
      element.classList.add('reveal-ready');
      revealObserver.observe(element);
    }
  });
  document.querySelectorAll('.hero__intro, .hero__portrait').forEach(el => el.classList.add('hero-enter'));
}
revealContent();
motion.addEventListener('change', () => {
  if (motion.matches) {
    revealObserver?.disconnect();
    document.querySelectorAll('.reveal-ready').forEach(el => el.classList.add('is-visible'));
  }
});
window.addEventListener('beforeprint', () => {
  document.querySelectorAll('.reveal-ready').forEach(el => el.classList.add('is-visible'));
});
