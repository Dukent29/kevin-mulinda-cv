const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const server = http.createServer((req,res) => {
  const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const file = path.join(root, pathname === '/' ? 'index.html' : pathname);
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  fs.readFile(file,(err,data) => { if(err) {res.writeHead(404).end();return;}
    res.setHeader('Content-Type', ({'.html':'text/html','.css':'text/css','.js':'text/javascript','.jpeg':'image/jpeg','.pdf':'application/pdf','.mp3':'audio/mpeg'})[path.extname(file)] || 'application/octet-stream'); res.end(data); });
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({executablePath:process.env.BROWSER_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 const results=[];
 for(let i=0;i<3;i++) {
  const context=await browser.newContext({viewport:{width:390,height:844}});
  const page=await context.newPage();
  await page.addInitScript(()=>{
   window.metrics={lcp:0,cls:0};
   new PerformanceObserver(l=>{for(const e of l.getEntries())window.metrics.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});
   new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.metrics.cls+=e.value;}).observe({type:'layout-shift',buffered:true});
  });
  const cdp=await context.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:93750});
  await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
  await page.goto(`http://127.0.0.1:${server.address().port}/`,{waitUntil:'load',timeout:60000});
  await page.waitForTimeout(3000);
  results.push(await page.evaluate(()=>({...window.metrics,navigation:performance.getEntriesByType('navigation')[0].toJSON(),domContentLoaded:performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd,resources:performance.getEntriesByType('resource').map(x=>({name:x.name.split('/').pop(),bytes:x.transferSize,duration:x.duration})),overflow:document.documentElement.scrollWidth>innerWidth})));
  if(i===0) { fs.mkdirSync(path.join(root,'artifacts'),{recursive:true}); await page.screenshot({path:path.join(root,'artifacts',`${process.argv[2]}-mobile.png`),fullPage:true}); }
  await context.close();
 }
 fs.writeFileSync(path.join(root,'artifacts',`${process.argv[2]}-performance.json`),JSON.stringify(results,null,2));
 console.log(JSON.stringify(results)); await browser.close();server.close();
})().catch(e=>{console.error(e);server.close();process.exitCode=1});

