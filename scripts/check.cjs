const fs=require('node:fs');
const assert=require('node:assert/strict');
const d=JSON.parse(fs.readFileSync('cv-data.json','utf8'));
function check(value){if(!value||typeof value!=='object')return;if('fr' in value||'en' in value){assert.equal(typeof value.fr,'string');assert.equal(typeof value.en,'string');assert(!/[?\uFFFD]/.test(value.fr+value.en));}else Object.values(value).forEach(check);}
check(d);
assert.equal(d.experience.length,5);
for(const employer of ['Bouygues','Kotan Voyage','Horspiste','Espoir Jeunes','BearStudio'])assert(JSON.stringify(d.experience).includes(employer));
const luminance=hex=>{const c=hex.match(/[a-f0-9]{2}/gi).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722;};
for(const [bg,colors] of [['ffffff',['18212b','43505d','a96500','b9470b']],['18110c',['f1e6d1','c5b49a','f2b332','ff7b28']],['ffffff',['202b2c','536060','795216']],['1c2422',['eef1e9','b5c2bb','e3bd78']],['eff4ef',['202b2c','536060']],['29392f',['eef1e9','b5c2bb']]])for(const c of colors){const a=luminance(bg),b=luminance(c),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);assert(ratio>=4.5);console.log(bg,c,ratio.toFixed(2));}
console.log('PASS: bilingual data, 5 employers, encoding, text contrast >=4.5:1.');
