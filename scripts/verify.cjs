const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const server=http.createServer((req,res)=>{
 const file=path.join(root,new URL(req.url,'http://localhost').pathname);
 fs.readFile(file,(e,d)=>{if(e){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.pdf':'application/pdf','.jpeg':'image/jpeg'})[path.extname(file)]||'application/octet-stream');res.end(d);});
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const base=`http://127.0.0.1:${server.address().port}/`;
 const browser=await chromium.launch({executablePath:process.env.BROWSER_PATH||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 fs.mkdirSync(path.join(root,'artifacts'),{recursive:true});
 for(const lang of ['fr','en']) {
  for(const theme of ['light','dark'])for(const width of [320,390,1280]) {
   await page.setViewportSize({width,height:900});
   await page.goto(base+(lang==='fr'?'index.html':'en.html')+`?theme=${theme}`);
   assert.equal(await page.locator('html').getAttribute('lang'),lang);
   assert.equal(await page.locator('html').getAttribute('data-theme'),theme);
   assert.equal(await page.locator('h1').count(),1);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   assert.match(await page.locator('#pdf-download').getAttribute('href'),new RegExp(`${lang.toUpperCase()}${theme==='dark'?'_DARK':''}\\.pdf$`));
   await page.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=600){scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,35));}scrollTo({top:0,behavior:'instant'});});
   // Full-page previews include sections outside the viewport; real reveals are tested separately below.
   await page.evaluate(()=>document.querySelectorAll('.reveal-ready').forEach(el=>el.classList.add('is-visible')));
   await page.waitForTimeout(900);
   assert(await page.evaluate(()=>Array.from(document.fonts).some(f=>f.family.includes('Oswald')&&f.status==='loaded')));
   await page.screenshot({path:path.join(root,'artifacts',`${lang}-${theme}-${width}.png`),fullPage:true});
  }
  for(const theme of ['light','dark']) {
  await page.goto(base+(lang==='fr'?'index.html':'en.html')+`?theme=${theme}`);
  assert.equal(await page.locator('#print-cv').getAttribute('href'),await page.locator('#pdf-download').getAttribute('href'));
  await page.locator('.contact-actions summary').click();
  const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#pdf-download').click()]);
  assert.equal(download.suggestedFilename(),`Kevin_Mulinda_Bruce_CV_${lang.toUpperCase()}${theme==='dark'?'_DARK':''}.pdf`);
  assert.equal(await download.failure(),null);
  }
 }
 await page.goto(base+'index.html?theme=dark');
 await page.locator('.language-switcher a[lang=en]').click();
 assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
 await page.locator('.theme-toggle').click();assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
 await page.reload();assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
 await page.goto(base+'index.html?lang=en');await page.waitForURL('**/en.html?lang=en');
 const nojs=await browser.newContext({javaScriptEnabled:false});const p=await nojs.newPage();
 await p.goto(base+'en.html');assert.match(await p.locator('.hero__role').innerText(),/IT SUPPORT/);await nojs.close();
 
 await page.goto(base+'en.html');
 assert.match(await page.locator('.hero__languages').innerText(),/English: fluent/);
 const pending=page.locator('.reveal-ready').first();
 assert(await pending.count()>0);
 await pending.scrollIntoViewIfNeeded();
 await page.waitForTimeout(900);
 assert.match(await pending.getAttribute('class'),/is-visible/);
 const reduced=await browser.newContext({reducedMotion:'reduce'});
 const reducedPage=await reduced.newPage();await reducedPage.goto(base+'en.html');
 assert.equal(await reducedPage.locator('.reveal-ready').count(),0);
 await reduced.close();
 assert.deepEqual(errors,[]);
 console.log('PASS: 12 language/theme/viewport combinations; downloads FR/EN; language and theme persistence; legacy query; no-JS; no overflow or JS errors.');
 await browser.close();server.close();
})().catch(e=>{console.error(e);server.close();process.exit(1)});

