// Cold HTTP transfers on simulated 1.6 Mbps / 150 ms latency; no PDF viewer startup.
const {chromium}=require(process.env.PLAYWRIGHT_PATH || 'playwright');
const fs=require('node:fs');
const http=require('node:http');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const server=http.createServer((req,res)=>{
  if(req.url==='/'){res.setHeader('Content-Type','text/html');return res.end('<title>Export benchmark</title>');}
  const name=path.basename(req.url);
  if(!/^Kevin_Mulinda_Bruce_CV_(FR|EN)(_DARK)?\.pdf$/.test(name)){res.writeHead(404).end();return;}
  res.setHeader('Content-Type','application/pdf');res.setHeader('Cache-Control','no-store');
  res.end(fs.readFileSync(path.join(root,name)));
});
(async()=>{
  let browser;
  try{
    await new Promise(r=>server.listen(0,'127.0.0.1',r));
    browser=await chromium.launch({executablePath:process.env.BROWSER_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
    const page=await browser.newPage();
    await page.goto(`http://127.0.0.1:${server.address().port}/`);
    const cdp=await page.context().newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
    await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:93750});
    const results=[];
    for(const lang of ['FR','EN'])for(const theme of ['light','dark']){
      const file=`Kevin_Mulinda_Bruce_CV_${lang}${theme==='dark'?'_DARK':''}.pdf`;
      const samples=[];
      for(let i=0;i<3;i++)samples.push(await page.evaluate(async file=>{
        const start=performance.now();const response=await fetch(file,{cache:'no-store'});
        if(!response.ok)throw Error('Download failed');
        const data=await response.arrayBuffer();return {ms:performance.now()-start,bytes:data.byteLength};
      },file));
      results.push({file,bytes:samples[0].bytes,transfer_median_ms:Math.round(samples.map(s=>s.ms).sort((a,b)=>a-b)[1])});
    }
    fs.writeFileSync(path.join(root,'artifacts',`downloads-${process.argv[2]}.json`),JSON.stringify(results,null,2));
    console.log(JSON.stringify(results,null,2));
  }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
