const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const assert = require('node:assert/strict');
(async () => {
 const root = path.resolve(__dirname, '..');
 const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
 try {
  const page = await browser.newPage();
  const errors=[]; page.on('pageerror', e=>errors.push(e.message));
  for (const lang of ['fr','en']) for (const width of [320,1280]) for (const theme of ['light','dark']) {
   await page.setViewportSize({width,height:900});
   await page.goto(pathToFileURL(path.join(root, lang==='fr'?'index.html':'en.html')).href+'?theme='+theme);
   await page.evaluate(()=>document.fonts.ready);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   const section=page.locator('section[aria-labelledby="projects"]');
   await section.evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
   await page.waitForTimeout(900);
   const text=await section.innerText();
   for(const value of ['Buildflow','Next.js','Smart Gardening']) assert(text.includes(value));
   assert(!text.includes('Dream Team'));
   assert(text.includes(lang==='en'?'Project concept':'Concept de projet'));
   assert(text.includes(lang==='en'?'offline':'hors connexion'));
   for(const repository of ['buildflow','smart-gardening-front']) {
    assert.equal(await section.locator(`a[href="https://github.com/Dukent29/${repository}"]`).count(),1);
   }
   assert(text.includes(lang==='en'?'Remote plant-care':'plantes à distance'));
   await section.screenshot({path:path.join(root,'artifacts',`projects-${lang}-${theme}-${width}.png`)});
  }
  assert.deepEqual(errors,[]);
  console.log('PASS: project content and layout in both languages, themes and desktop/mobile widths.');
 } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exit(1)});
