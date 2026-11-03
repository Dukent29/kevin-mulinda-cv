const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const path=require('node:path');
const fs=require('node:fs');
const {pathToFileURL}=require('node:url');
const {execFileSync}=require('node:child_process');
async function generatePdfs(){
 const root=path.resolve(__dirname,'..');
 const temporary=path.join(root,'tmp','pdfs');
 fs.mkdirSync(temporary,{recursive:true});
 const output=process.env.PDF_OUTPUT_DIR ? path.resolve(process.env.PDF_OUTPUT_DIR) : fs.mkdtempSync(path.join(temporary,'build-'));
 fs.mkdirSync(output,{recursive:true});
 const browser=await chromium.launch({executablePath:process.env.BROWSER_PATH||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 try {
  const page=await browser.newPage({viewport:{width:1120,height:1000},reducedMotion:'reduce'});
  await page.emulateMedia({media:'screen'});
  for(const lang of ['fr','en']) for(const theme of ['light','dark']) {
   const url=pathToFileURL(path.join(root,lang==='fr'?'index.html':'en.html'));
   url.searchParams.set('theme',theme);
   await page.goto(url.href);
   await page.evaluate(()=>document.fonts.ready);
   await page.addStyleTag({path:path.join(root,'pdf-website.css')});
   await page.evaluate(()=>document.querySelectorAll('.timeline__section-label').forEach(el=>{el.textContent=el.textContent.replace(/^\s*▸\s*/, '');}));
   await page.evaluate(()=>document.querySelectorAll('.reveal-ready').forEach(el=>el.classList.add('is-visible')));
   const name=`Kevin_Mulinda_Bruce_CV_${lang.toUpperCase()}${theme==='dark'?'_DARK':''}.pdf`;
   // Fit the complete desktop composition on one A4 sheet, with a small
   // rounding allowance so changes in translated text cannot add a page.
   const height=await page.locator('.cv-page').evaluate(el=>el.getBoundingClientRect().height);
   const scale=Math.min(0.7,1114/height);
   if(scale<0.55) throw new Error(`PDF content is too tall for readable A4 output: ${lang}`);
   const inset=Math.max(0,(793.7/scale-1120)/2);
   await page.addStyleTag({content:`.cv-page { margin-left: ${inset}px; }`});
   await page.pdf({path:path.join(output,name),format:'A4',scale,preferCSSPageSize:true,printBackground:true,displayHeaderFooter:false,tagged:false});
   execFileSync(process.env.PYTHON_PATH || 'python',[path.join(__dirname,'optimize-pdf.py'),path.join(output,name)],{stdio:'inherit'});
   console.log(`Layout: ${Math.round(height)}px, scale ${scale.toFixed(3)}`);
   console.log('Generated '+name+' from website '+theme+' theme');
  }
  fs.copyFileSync(path.join(output,'Kevin_Mulinda_Bruce_CV_FR.pdf'),path.join(output,'Kevin_Mulinda_Bruce_CV.pdf'));
  // Publish only after every variant has passed compression and the byte budget.
  if(!process.env.PDF_OUTPUT_DIR) for(const name of fs.readdirSync(output).filter(name=>name.endsWith('.pdf'))) {
   fs.copyFileSync(path.join(output,name),path.join(root,name));
  }
 } finally {await browser.close();}
}
module.exports=generatePdfs;
if(require.main===module)generatePdfs().catch(e=>{console.error(e);process.exit(1)});
