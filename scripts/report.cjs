const fs=require('node:fs');
const {execFileSync}=require('node:child_process');
const before=JSON.parse(fs.readFileSync('artifacts/before-performance.json'));
const after=JSON.parse(fs.readFileSync('artifacts/after-performance.json'));
const diagnostic=JSON.parse(fs.readFileSync('artifacts/diagnostic-performance.json'));
const median=(runs,key)=>runs.map(x=>x[key]).sort((a,b)=>a-b)[1];
const range=runs=>runs.map(x=>(x.lcp/1000).toFixed(3)).join(', ');
const size=file=>fs.statSync(file).size;
const old=file=>execFileSync('git',['show','HEAD:'+file]).length;
const lines=[
 '# Mesures de performance — 16 octobre 2026',
 '',
 'Protocole : Edge/Chromium headless, 390 × 844 px, contexte navigateur neuf par essai, CPU ralenti 4×, latence 150 ms, débit descendant 200 000 octets/s, serveur HTTP local sans compression. Trois navigations par série. LCP/CLS collectés par PerformanceObserver ; Resource Timing et Navigation Timing pour le diagnostic. Ce sont des mesures de laboratoire, pas un score Lighthouse ni des données de visiteurs réels.',
 '',
 '| Mesure | Avant | Après (série principale) | Diagnostic final |',
 '|---|---:|---:|---:|',
 `| LCP médian | ${(median(before,'lcp')/1000).toFixed(3)} s | ${(median(after,'lcp')/1000).toFixed(3)} s | ${(median(diagnostic,'lcp')/1000).toFixed(3)} s |`,
 `| CLS médian | ${median(before,'cls')} | ${median(after,'cls')} | ${median(diagnostic,'cls')} |`,
 `| DOMContentLoaded médian | ${(median(before,'domContentLoaded')/1000).toFixed(3)} s | ${(median(after,'domContentLoaded')/1000).toFixed(3)} s | ${(median(diagnostic,'domContentLoaded')/1000).toFixed(3)} s |`,
 '',
 `LCP individuels avant : ${range(before)} s. Après : ${range(after)} s. Diagnostic final : ${range(diagnostic)} s.`,
 '',
 'Conclusion : le poids diminue nettement, mais le gain de LCP n’est pas établi de façon robuste. La série après principale est plus lente que la série initiale ; la répétition diagnostique est plus rapide. Ne pas communiquer un pourcentage d’accélération à partir de ces résultats instables. La cible LCP n’est pas démontrée. Le CLS final est nul. L’INP nécessite des interactions représentatives et idéalement des données terrain ; il n’est pas mesuré ici.',
 '',
 'Dans la série diagnostique, le document est reçu en 0,21 à 0,37 s, alors que DOMContentLoaded arrive entre 2,94 et 4,61 s. Les ressources locales prennent environ 0,27 à 0,45 s. Cela situe le retard après la réception du document, dans le rendu/l’exécution ou l’ordonnancement du navigateur ralenti ; cela ne prouve pas une cause unique. La variabilité de la machine et le throttling rendent les valeurs absolues peu transposables à la production.',
 '',
 '| Taille brute | Avant (octets) | Après (octets) |',
 '|---|---:|---:|',
 ...['index.html','styles.css','translations.js','Kevin_Mulinda_Bruce_CV_FR.pdf','Kevin_Mulinda_Bruce_CV_EN.pdf'].map(f=>`| ${f} | ${old(f)} | ${size(f)} |`),
 '',
 `Le script de thème (${size('theme-init.js')} octets source) est intégré dans le HTML et inclus dans sa taille. Le JSON bilingue et le générateur ne sont pas chargés par le navigateur. Le portrait reste à ${size('image_2.jpeg')} octets. Aucun script tiers, aucune police distante, aucun téléchargement audio/PDF au chargement dans les captures réseau finales. Les PDF ne sont chargés qu’au clic.`,
 '',
 'Changements justifiés : suppression des polices bloquantes et animations permanentes ; système de polices local ; suppression du parcours/traduction de tout le DOM ; HTML statique directement dans la langue demandée ; thème appliqué avant la première peinture ; dimensions explicites de photo ; espace réservé au bouton de thème ; audio preload=none ; téléchargement PDF statique.',
 '',
 'Les données brutes sont dans artifacts/before-performance.json, after-performance.json et diagnostic-performance.json. Pour reproduire : node scripts/measure.cjs nom-serie. Ne pas utiliser les captures intermédiaires comme preuve d’un gain de vitesse. Refaire la mesure sur l’hébergement final avec cache/compression réels et un navigateur stable avant de conclure sur les Core Web Vitals.'
];
fs.writeFileSync('PERFORMANCE.md',lines.join('\n')+'\n');
console.log(lines.filter(x=>x.startsWith('|')).join('\n'));
