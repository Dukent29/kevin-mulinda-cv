const fs=require('node:fs');
const path=require('node:path');
process.chdir(path.resolve(__dirname,'..'));
const d=JSON.parse(fs.readFileSync('cv-data.json','utf8'));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
for(const lang of ['fr','en']) {
 const t=x=>esc(typeof x==='string'?x:x[lang]);
 const label=k=>t(d.labels[k]);
 const entry=(x,i)=>`<article class="entry ${i===0?'entry--featured':''}"><h3>${t(x.title)}</h3><p class="entry-meta">${t(x.meta)}</p>${x.bullets.length?`<ul>${x.bullets.map(b=>`<li>${t(b)}</li>`).join('')}</ul>`:''}${x.description?`<p>${t(x.description)}</p>`:''}${x.repository ? `<p class="project-source"><a href="${esc(x.repository)}">GitHub: ${esc(x.repository.replace('https://github.com/', ''))}</a></p>` : ''}</article>`;
 const section=(id,body,extra='')=>`<section class="section ${extra}" aria-labelledby="${id}"><h2 id="${id}">${label(id)}</h2>${body}</section>`;
 const contact=`<address><a href="mailto:mulindakevin7@gmail.com">mulindakevin7@gmail.com</a><a href="tel:+33626993695">06 26 99 36 95</a><a href="https://www.linkedin.com/in/mulindakevin">LinkedIn<span class="print-url">: linkedin.com/in/mulindakevin</span></a><a href="https://github.com/dukent29">GitHub<span class="print-url">: github.com/dukent29</span></a></address>`;
 const hero=`<header class="hero"><div><p class="name">${t(d.name)}</p><h1>${t(d.role)}</h1><p class="subtitle">${t(d.subtitle)}</p><p class="location">${t(d.location)}</p><p class="languages">${t(d.languages)}</p>${contact}</div><img class="portrait" src="image_2.jpeg" width="120" height="144" fetchpriority="high" alt="${lang==='fr'?'Portrait de':'Portrait of'} Kevin Mulinda Bruce"></header>`;
 const summary=section('profile',`<p>${t(d.summary)}</p>`);
 const experience=section('experience',`<p class="section-note">${label('relevance')}</p>${d.experience.map(entry).join('')}`);
 const skills=section('skills',d.skills.map(s=>`<div class="skill-group"><h3>${t(s.title)}</h3><p class="skill-level">${t(s.detail)}</p><p>${t(s.items)}</p></div>`).join(''));
 const education=section('education',d.education.map(e=>`<article class="education-item"><h3>${t(e.title)}</h3><p class="entry-meta">${t(e.meta)}</p></article>`).join(''));
 const projects=section('projects',d.projects.map(e=>entry(e,-1)).join(''));
 const additional=section('additional',entry(d.additional,-1));
 const interests=section('interests',`<p>${t(d.interests)}</p>`);
 const strengths=section('strengths',`<p>${t(d.strengths)}</p>`);
 const head=print=>`<!doctype html>\n<html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${t(d.name)} — ${t(d.role)}</title><meta name="description" content="${t(d.role)} ${lang === 'fr' ? 'à' : 'in'} Rouen. ${t(d.subtitle)}. ${t(d.location)}."><meta name="color-scheme" content="light dark">${print?'':`<link rel="alternate" hreflang="fr" href="index.html"><link rel="alternate" hreflang="en" href="en.html"><script>${fs.readFileSync('theme-init.js','utf8')}</script>`}<link rel="stylesheet" href="${print ? 'print-styles.css' : 'styles.css'}">${print?'<meta name="robots" content="noindex">':''}</head>`;
 const toolbar=`<a class="skip-link" href="#main">${label('skip')}</a><nav class="toolbar" aria-label="${lang==='fr'?'Affichage et téléchargement':'Display and download'}"><span class="toolbar-brand">KM<span> / CV</span></span><div class="controls"><div class="language-switcher"><a href="index.html" hreflang="fr" lang="fr" ${lang==='fr'?'aria-current="page"':''}>FR</a><a href="en.html" hreflang="en" lang="en" ${lang==='en'?'aria-current="page"':''}>EN</a></div><button class="theme-toggle" type="button" aria-label="${label('theme')}" hidden>◐</button><a class="download" id="pdf-download" href="Kevin_Mulinda_Bruce_CV_${lang.toUpperCase()}.pdf" download>↓ <span>${label('download')}</span><small>PDF</small></a></div></nav>`;
 const footer=`<footer><a href="mailto:mulindakevin7@gmail.com">${label('contact')} ↗</a><div><a href="print-${lang}.html" target="_blank">${label('print')}</a><details class="music-player"><summary>${label('music')}</summary><audio controls preload="none" src="i_wonder_mp3_31167.mp3"></audio></details></div></footer>`;
 const structured={ '@context':'https://schema.org','@type':'Person',name:d.name,homeLocation:{'@type':'Place',name:'Rouen, France'},knowsLanguage:['French','English','Spanish'],sameAs:['https://www.linkedin.com/in/mulindakevin','https://github.com/dukent29']};
 fs.writeFileSync(lang==='fr'?'index.html':'en.html', require('./web-template.cjs')(d, lang, head(false), structured));
 fs.writeFileSync(`print-${lang}.html`,head(true)+`<body class="print-document"><nav class="print-controls"><a href="${lang==='fr'?'index.html':'en.html'}">← CV</a><button type="button" id="print-button">${label('print')}</button></nav><main><div class="print-sheet">${hero}${summary}${experience}${additional}</div><div class="print-sheet"><p class="print-heading">${t(d.name)} · ${t(d.role)}</p>${skills}${education}${projects}${strengths}${interests}</div></main><script src="print.js" defer></script></body></html>\n`);
}
console.log('Built FR/EN web and print pages from cv-data.json');
