const fs = require('node:fs');
const path = require('node:path');
const root=path.resolve(__dirname,'..');
// Dark PDFs are real themed exports; never replace them with light PDFs.
fs.copyFileSync(path.join(root,'Kevin_Mulinda_Bruce_CV_FR.pdf'),path.join(root,'Kevin_Mulinda_Bruce_CV.pdf'));
console.log('Default PDF alias updated; all four theme/language exports preserved.');
