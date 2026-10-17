// The original CV's visual structure, with the shared bilingual content model.
module.exports = (d, lang, head, structured) => {
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const t = x => esc(typeof x === 'string' ? x : x[lang]);
  const l = key => t(d.labels[key]);
  const panel = (id, number, body) => `<section class="panel" aria-labelledby="${id}"><h2 id="${id}"><span>${number}</span> ${l(id)}</h2>${body}</section>`;
  const entry = (x, badge) => `<article class="entry"><div class="entry__badge" aria-hidden="true">${badge}</div><div class="entry__body"><h3>${t(x.title)}</h3><p class="entry__company">${t(x.meta)}</p>${x.bullets.length ? `<ul>${x.bullets.map(b => `<li>${t(b)}</li>`).join('')}</ul>` : ''}${x.description ? `<p>${t(x.description)}</p>` : ''}</div></article>`;
  const chips = text => `<ul class="chips">${text[lang].split(' · ').map(s => `<li>${esc(s)}</li>`).join('')}</ul>`;
  const portrait = lang === 'fr' ? 'Portrait de Kevin Mulinda Bruce' : 'Portrait of Kevin Mulinda Bruce';
  head = head.replace('</head>', '<link rel="stylesheet" href="fonts.css"><link rel="preload" href="fonts/inter-400.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="fonts/oswald-700.woff2" as="font" type="font/woff2" crossorigin></head>');
  return head + `<body>
  <a class="skip-link" href="#main">${l('skip')}</a>
  <div class="display-controls"><nav class="language-switcher" aria-label="${lang === 'fr' ? 'Choisir la langue' : 'Choose language'}"><a href="index.html" lang="fr" hreflang="fr" ${lang === 'fr' ? 'aria-current="page"' : ''}>FR</a><a href="en.html" lang="en" hreflang="en" ${lang === 'en' ? 'aria-current="page"' : ''}>EN</a></nav><button class="theme-toggle" type="button" aria-label="${l('theme')}" hidden>◐</button></div>
  <main class="cv-page" id="main" tabindex="-1">
    <header class="hero"><div class="hero__intro">
      <p class="hero__kicker">/// rouen_france - ${lang === 'fr' ? 'profil_disponible' : 'available_profile'}</p>
      <h1><span>KEVIN MULINDA</span><span class="hero__name-accent">BRUCE</span></h1>
      <p class="hero__role">${t(d.role)}</p><p class="hero__tagline">${t(d.subtitle)}</p>
      <p class="hero__meta hero__location">${t(d.location)}</p><p class="hero__meta hero__languages">${t(d.languages)}</p>
      <address class="hero__meta hero__contacts"><a href="tel:+33626993695">06 26 99 36 95</a><a href="mailto:mulindakevin7@gmail.com">mulindakevin7@gmail.com</a><a href="https://www.linkedin.com/in/mulindakevin">LinkedIn</a><a href="https://github.com/dukent29">GitHub</a></address>
    </div><div class="hero__portrait"><span class="hero__ring" aria-hidden="true"></span><span class="hero__ring hero__ring--inner" aria-hidden="true"></span><img src="image_2.jpeg" width="132" height="132" fetchpriority="high" alt="${portrait}"><span class="hero__spot" aria-hidden="true"></span></div></header>
    <div class="content"><aside class="sidebar">
      ${panel('profile', '01', `<p>${t(d.summary)}</p>`)}
      ${panel('skills', '02', d.skills.map(s => `<div class="skill-group"><h3>${t(s.title)}</h3><p class="skill-level">${t(s.detail)}</p>${chips(s.items)}</div>`).join(''))}
      ${panel('education', '03', d.education.map(e => `<article class="education-item"><h3>${t(e.title)}</h3><p>${t(e.meta)}</p></article>`).join(''))}
      ${panel('interests', '04', `<ul class="interest-list interest-list--sidebar">${d.interests[lang].split(' · ').map(s => `<li>${esc(s)}</li>`).join('')}</ul>`)}
      ${panel('strengths', '05', chips(d.strengths))}
    </aside><div class="timeline"><div class="timeline__grid"><div class="timeline__main">
      <section aria-labelledby="experience"><h2 class="timeline__section-label" id="experience">▸ ${l('experience')}</h2><p class="timeline-group">— SIDE A — ${l('relevance')}</p>${d.experience.map((x,i) => entry(x, `A${i+1}`)).join('')}</section>
      <section class="timeline-block" aria-labelledby="projects"><h2 class="timeline__section-label" id="projects">▸ ${l('projects')}</h2><p class="timeline-group">— SIDE B —</p>${d.projects.map((x,i) => entry(x, `B${i+1}`)).join('')}</section>
      <section class="timeline-block" aria-labelledby="additional"><h2 class="timeline__section-label" id="additional">▸ ${l('additional')}</h2>${entry(d.additional, 'C1')}</section>
    </div></div><footer class="footer"><div class="footer__text">${t(d.location)}</div><details class="music-player"><summary aria-label="${l('music')}" title="${l('music')}"><span class="footer__bars" aria-hidden="true">${'<span></span>'.repeat(10)}</span><span class="music-player__play" aria-hidden="true">▶</span></summary><div class="music-player__embed"><audio controls preload="none" src="i_wonder_mp3_31167.mp3"></audio></div></details></footer></div></div>
  </main>
  <details class="contact-actions"><summary aria-label="${l('contact')}"><svg class="contact-actions__contact-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M5 4h10v16H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm-2 4h3m-3 4h3m-3 4h3m5-8a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-3 8a3 3 0 0 1 6 0"/></svg><span class="contact-actions__close-icon" aria-hidden="true"></span></summary><nav class="contact-actions__menu" aria-label="${l('contact')}"><a href="mailto:mulindakevin7@gmail.com"><span class="contact-actions__icon" aria-hidden="true">✉</span><span><strong>Email</strong><small>mulindakevin7@gmail.com</small></span></a><a href="tel:+33626993695"><span class="contact-actions__icon" aria-hidden="true">☎</span><span><strong>${lang === 'fr' ? 'Appeler' : 'Call'}</strong><small>06 26 99 36 95</small></span></a><a id="pdf-download" href="Kevin_Mulinda_Bruce_CV_${lang.toUpperCase()}.pdf" download><span class="contact-actions__icon" aria-hidden="true">↓</span><span><strong>${l('download')}</strong><small>PDF · A4</small></span></a><a id="print-cv" href="Kevin_Mulinda_Bruce_CV_${lang.toUpperCase()}.pdf" target="_blank"><span class="contact-actions__icon" aria-hidden="true">↗</span><strong>${l('print')}</strong></a></nav></details>
  <script type="application/ld+json">${JSON.stringify(structured)}</script><script src="translations.js" defer></script></body></html>\n`;
};
