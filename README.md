# Current design correction

The original visual identity has been restored: Inter/Oswald typography, gold/orange palette, circular portrait, numbered sidebar panels, outlined skill chips, A/B timeline badges, equalizer and floating contact menu. The original CSS is retained with small responsive/readability overrides. Local fonts are in fonts/ (OFL licenses included), declared in fonts.css. The browser has no Google Fonts request.

English is fluent and listed first. French remains fluent; no unsupported lower level was assigned. Both web languages and PDFs use this correction. Content blocks gently fade/slide into view once while scrolling. No scroll interception is used. Reduced-motion, no-JavaScript and print views keep all text visible.

PDF downloads now render the actual website with its fonts, portrait, columns and selected light/dark theme. There are four separate FR/EN × light/dark files; animations are frozen in PDF only. `pdf-website.css` contains export-only A4 overrides. Download and print links follow the current language and theme. Rebuild with `node scripts/build.cjs`, then `node scripts/pdf.cjs`. `node scripts/verify.cjs` tests the site and downloads without replacing PDFs; `python scripts/verify_pdf.py` validates and renders all four exports. `scripts/update-aliases.cjs` only updates the default French light alias.

The following notes describe the earlier audit and implementation; visual-layout and performance claims about that earlier redesign are historical, superseded by this correction.

---

# Kevin Mulinda Bruce — CV bilingue

Site statique HTML/CSS/JavaScript. Aucun framework, serveur applicatif ou paquet client requis. Le contenu se trouve dans `cv-data.json`; `scripts/build.cjs` produit les pages françaises, anglaises et les deux mises en page imprimables avec un seul gabarit.

## Utilisation et maintenance

- Ouvrir `index.html` (français) ou `en.html` (anglais), ou servir le dossier avec Apache/XAMPP.
- Modifier `cv-data.json`, puis exécuter `node scripts/build.cjs`.
- Générer les PDF avec `node scripts/pdf.cjs`. Outil de développement : Playwright et Edge/Chromium. Définir `PLAYWRIGHT_PATH` si Playwright est installé hors du projet, et `BROWSER_PATH` pour un autre exécutable Chromium.
- `node scripts/verify.cjs` vérifie le site avec un serveur HTTP temporaire et régénère les PDF. Ensuite, `node scripts/update-aliases.cjs` synchronise les anciennes URL.
- `python scripts/verify_pdf.py` contrôle et rend les PDF. Nécessite pypdf et pypdfium2, disponibles dans le runtime Codex utilisé ici.
- `node scripts/check.cjs` valide les traductions, l'encodage et les contrastes.
- `node scripts/measure.cjs after` produit trois mesures mobiles simulées et une capture dans `artifacts/`.

Les PDF sont préconstruits : aucune bibliothèque PDF n'est téléchargée côté client. Publier les HTML, CSS, JavaScript, le portrait, les PDF et le MP3 pour conserver le lecteur facultatif. Les dossiers `scripts/` et `artifacts/` et le contenu source JSON ne sont pas nécessaires au fonctionnement public. Les anciennes images PNG sont conservées comme archives et ne sont plus référencées par les pages.

## Organisation

Le métier cible domine l'en-tête, suivi de la mobilité, des langues et des coordonnées. Le profil utilise les textes demandés. Bouygues est mis en avant pour sa pertinence, puis les expériences web sont condensées sans suppression d'employeur ni modification des périodes. Les projets, la formation et les expériences hors informatique ont leurs propres sections. Les compétences Microsoft et réseau sont explicitement des connaissances de base ; TypeScript : depuis 2023. Le développement reste complémentaire.

Sur mobile, le contenu suit une colonne. Sur ordinateur, l'expérience et les compétences occupent deux colonnes. Les deux thèmes conservent un accent doré discret. Les PDF ont une seule colonne, deux pages A4 : profil et expériences sur la première, compétences, formation et projets sur la seconde. Le rendu imprimé est clair, quel que soit le thème du site.

## Audit initial

- `index.html` portait tout le contenu français. `translations.js` parcourait les nœuds texte du DOM avec un dictionnaire français/anglais : fragile lors d'une réécriture.
- `styles.css` comportait 24 714 octets, de nombreuses décorations et animations permanentes. Les polices Google étaient bloquantes pour le rendu. Leur requête a duré environ 3 secondes dans les essais initiaux, avec transfert non observable/échec possible dans cet environnement.
- Le portrait JPEG ne pesait que 15 764 octets : il est conservé, avec dimensions explicites.
- Le MP3 de 3,9 Mo utilisait `preload=metadata`. Le lecteur est conservé avec `preload=none`; aucun transfert audio n'est observé au chargement dans les mesures finales.
- Pas de framework, hydratation, package.json, TypeScript ou bibliothèque de génération PDF client. Aucun paquet applicatif à supprimer.
- Les téléchargements étaient des fichiers statiques distincts. `pdf-export-en.html` imprimait une image avec dimensions non A4 et débordement masqué. Il mène maintenant au véritable gabarit anglais imprimable.
- Absence de méta-description ; contacts principaux en texte brut ; titre générique ; niveaux de titres peu structurés ; langues reléguées en bas. Ces points sont corrigés avec titres, description traduite, liens alternatifs, données Person minimales, liens de contact, navigation clavier et lien d'évitement.

## Validation et limites

12 combinaisons testées : FR/EN × clair/sombre × 320/390/1280 px. Pas de débordement horizontal ou d'erreur JavaScript. Téléchargements FR/EN, liens de fichiers, navigation de langue avec thème conservé, rechargement du thème, ancien paramètre `?lang=en`, lecture sans JavaScript et génération statique vérifiés. Les contrôles sont natifs et nommés, avec focus visible. Les couleurs principales de texte dépassent 4,5:1 sur leurs fonds (contrôle automatisé) ; ce n'est pas un audit WCAG complet.

Les deux PDF passent `verify_pdf.py` : 2 pages, dimensions A4, texte extractible, quatre annotations de liens, présence des cinq employeurs et des niveaux de connaissance. Les quatre pages ont été rendues et inspectées visuellement, sans coupure ni chevauchement. Les captures web sont dans `artifacts/`.

Aucun build/lint/typecheck npm n'existait. Le générateur Node, les contrôles de syntaxe `node --check`, les tests navigateur, les contrôles PDF et `git diff --check` ont été utilisés. Les adresses mail/téléphone ont été conservées et les protocoles contrôlés, sans appel ni envoi. GitHub et LinkedIn ont conservé les URL fournies ; l'outil web n'a pas pu récupérer les profils (cache miss). Leur disponibilité publique et la propriété des comptes restent à vérifier manuellement.

Le « oui » de confirmation reçu pendant cette intervention ne précisait pas les niveaux : Microsoft 365, Active Directory et réseau restent présentés prudemment comme connaissances de base/notions, sans administration avancée ni certification. La mention Master 1 depuis octobre 2025 est conservée de la source ; vérifier si l'année de formation doit maintenant être actualisée. Aucun statut « en poste » n'est ajouté à Kotan Voyage, dont la période se termine en septembre 2026.

## Fichiers modifiés ou ajoutés

- `index.html`, `en.html` : pages générées, sans besoin de JavaScript pour lire le contenu.
- `cv-data.json`, `scripts/build.cjs` : source bilingue et gabarit commun.
- `styles.css`, `theme-init.js`, `translations.js` : présentation, initialisation du thème avant peinture et interactions légères.
- `print-fr.html`, `print-en.html`, `print.js`, `pdf-export-en.html` : impression et compatibilité avec l'ancien export.
- Les cinq PDF existants : FR/EN et anciens noms, tous synchronisés avec le nouveau contenu ; les anciennes URL DARK fournissent volontairement le même PDF clair professionnel.
- `scripts/pdf.cjs`, `scripts/update-aliases.cjs`, `scripts/verify.cjs`, `scripts/verify_pdf.py`, `scripts/check.cjs`, `scripts/measure.cjs`, `scripts/report.cjs` : génération et vérification reproductibles.
- `artifacts/` : captures, mesures brutes, texte extrait et validation PDF ; `PERFORMANCE.md` : comparaison détaillée.

Aucun déploiement distant n'a été réalisé. Compression HTTP, cache CDN et Core Web Vitals de visiteurs réels nécessitent une vérification sur l'hébergement cible ; aucun réglage serveur non testé n'est imposé au projet.
