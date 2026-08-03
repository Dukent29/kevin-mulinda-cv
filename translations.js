const translations = {
  "/// rouen_france - profil_disponible": "/// rouen_france - available_profile",
  "SUPPORT NUMÉRIQUE // WEB // OUTILS BUREAUTIQUES // ACCOMPAGNEMENT UTILISATEURS": "IT SUPPORT // WEB // OFFICE TOOLS // USER ASSISTANCE",
  "PROFIL": "PROFILE",
  "Professionnel de l'informatique polyvalent, à l'aise entre support utilisateurs, bureautique, maintenance matérielle et projets web. Fiable, réactif et pédagogue, je transforme les besoins du quotidien en solutions simples et concrètes. Actuellement en Master 1 Ingénierie informatique.": "Versatile IT professional experienced in user support, office software, hardware maintenance and web projects. Reliable, responsive and patient, I turn everyday needs into simple, practical solutions. Currently completing the first year of a Master's degree in Computer Engineering.",
  "COMPÉTENCES": "SKILLS",
  "COMPÉTENCES INFORMATIQUES": "IT SKILLS",
  "bureautique": "office software",
  "dépannage": "troubleshooting",
  "maintenance matérielle": "hardware maintenance",
  "assistance utilisateurs": "user support",
  "préparation des postes utilisateurs": "workstation setup",
  "réseaux": "networking",
  "DÉVELOPPEMENT WEB": "WEB DEVELOPMENT",
  "BACK-END & DONNÉES": "BACK END & DATA",
  "OUTILS": "TOOLS",
  "FORMATION": "EDUCATION",
  "Master 1 Ingénierie informatique": "Master's Year 1 in Computer Engineering",
  "Need For School, Rouen — octobre 2025 → aujourd'hui": "Need For School, Rouen — October 2025 → present",
  "Bac+3 Développement & Intégration Web & applications mobiles": "Bachelor's degree in Web Development, Integration & Mobile Applications",
  "Need For School, Rouen — Octobre 2022 → septembre 2025": "Need For School, Rouen — October 2022 → September 2025",
  "Développement & Intégration Web": "Web Development & Integration",
  "CENTRES D'INTÉRÊT": "INTERESTS",
  "Cuisine": "Cooking",
  "Cinéma": "Cinema",
  "Documentaires": "Documentaries",
  "Réseaux sociaux": "Social media",
  "Football": "Football",
  "Voyages": "Travel",
  "Sensations fortes": "Thrill-seeking activities",
  "Découvertes culturelles": "Cultural discovery",
  "LANGUES": "LANGUAGES",
  "Français & anglais — courants": "French & English — fluent",
  "Espagnol — notions": "Spanish — basic",
  "ATOUTS": "STRENGTHS",
  "DISPONIBLE POUR DE NOUVEAUX DÉFIS • MOBILITÉ SELON OPPORTUNITÉ": "AVAILABLE FOR NEW CHALLENGES • OPEN TO RELOCATION",
  "Autonomie": "Independent",
  "Esprit d'équipe": "Team player",
  "Énergie": "Energetic",
  "▸ EXPÉRIENCES PROFESSIONNELLES": "▸ PROFESSIONAL EXPERIENCE",
  "— SIDE A — EN POSTE": "— SIDE A — EXPERIENCE",
  "Développeur web — Kotan Voyage": "Web Developer — Kotan Voyage",
  "sept. 2025 → sept. 2026": "Sep. 2025 → Sep. 2026",
  "Développement de sites de réservation pour voyages, hôtels et restaurants.": "Developed booking websites for travel, hotels and restaurants.",
  "Construction et structuration de bases de données.": "Built and structured databases.",
  "Mise en place d'automatisations pour les flux métiers.": "Implemented automations for business workflows.",
  "Gestion des paiements, webhooks et vérifications associées.": "Managed payments, webhooks and related verifications.",
  "Intégration d'APIs comme RateHawk pour les réservations de séjours et de transport.": "Integrated APIs such as RateHawk for accommodation and transport bookings.",
  "Assistant informatique / déploiement bureautique": "IT Support Assistant / Office Software Deployment",
  "Bouygues — avr. 2025 → août 2025": "Bouygues — Apr. 2025 → Aug. 2025",
  "Installation et configuration d'outils bureautiques et de communication pour les utilisateurs.": "Installed and configured office and communication tools for users.",
  "Préparation des postes, espaces utilisateurs et environnements de travail.": "Prepared workstations, user accounts and work environments.",
  "Accompagnement à la prise en main des logiciels internes et résolution des difficultés courantes.": "Helped users get started with internal software and resolved common issues.",
  "Développeur web en alternance": "Apprentice Web Developer",
  "Horspiste — oct. 2023 → août 2024": "Horspiste — Oct. 2023 → Aug. 2024",
  "Développement de nombreux sites web, intranets et PWA, avec une forte utilisation de WordPress et Elementor.": "Developed numerous websites, intranets and PWAs, primarily using WordPress and Elementor.",
  "Travail en équipe avec les designers pour intégrer et faire évoluer les projets locaux.": "Collaborated with designers to build and improve client projects.",
  "Mise en place du site moncarrebois.fr et d'un site e-commerce pour permettre aux clients d'acheter des bois décoratifs en forme carrée pour la maison, le bureau et d'autres usages.": "Built moncarrebois.fr and its online store, enabling customers to purchase square decorative wood pieces for homes, offices and other uses.",
  "Stagiaire front-end": "Front-end Developer Intern",
  "Espoir Jeunes — avr. 2023 → juin 2023": "Espoir Jeunes — Apr. 2023 → Jun. 2023",
  "Refonte d'un site vitrine, attention portée au responsive design, à l'accessibilité et au SEO de base.": "Redesigned a showcase website with a focus on responsive design, accessibility and fundamental SEO.",
  "Développeur full-stack en alternance": "Apprentice Full-stack Developer",
  "BearStudio — sept. 2021 → juil. 2022": "BearStudio — Sep. 2021 → Jul. 2022",
  "Développement d'interfaces responsives avec Next.js et Tailwind CSS.": "Developed responsive interfaces with Next.js and Tailwind CSS.",
  "Contribution aux fonctionnalités front-end et back-end avec Firebase et Node.js, en collaboration avec le design.": "Contributed to front-end and back-end features using Firebase and Node.js, in collaboration with the design team.",
  "Expériences complémentaires": "Additional Experience",
  "Plongeur hôtel-restaurant · Agent de nettoyage bureaux": "Hotel/restaurant kitchen porter · Office cleaner",
  "Travail en rythme soutenu, ponctualité, autonomie, entraide et respect strict des consignes.": "Worked effectively in fast-paced settings, demonstrating punctuality, independence, teamwork and strict adherence to procedures.",
  "— SIDE B — PROJETS SÉLECTIONNÉS": "— SIDE B — SELECTED PROJECTS",
  "Gestion des rôles, espaces utilisateurs et authentification JWT.": "Role management, user workspaces and JWT authentication.",
  "Suivi de données, alertes et conseils utilisateurs.": "Data monitoring, alerts and user guidance.",
  "Envoyer un message": "Send a message",
  "Appeler": "Call",
  "CV en PDF": "CV in PDF",
  "Télécharger": "Download"
};

if (new URLSearchParams(window.location.search).get("export") === "pdf") {
  document.documentElement.classList.add("pdf-export");
}

const originalText = new Map();
const textNodes = [];
const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
let node;

while ((node = walker.nextNode())) {
  const value = node.nodeValue.trim();
  if (value && translations[value]) {
    originalText.set(node, node.nodeValue);
    textNodes.push(node);
  }
}

const attributeTranslations = [
  [document.querySelector(".hero__portrait"), "aria-label", "Portrait de Kevin Mulinda Bruce", "Portrait of Kevin Mulinda Bruce"],
  [document.querySelector(".hero__portrait img"), "alt", "Portrait de Kevin Mulinda Bruce", "Portrait of Kevin Mulinda Bruce"],
  [document.querySelector(".music-player summary"), "aria-label", "Ouvrir le lecteur de musique", "Open the music player"],
  [document.querySelector(".music-player summary"), "title", "Écouter Good Morning", "Listen to Good Morning"],
  [document.querySelector(".contact-actions summary"), "aria-label", "Ouvrir les options de contact", "Open contact options"],
  [document.querySelector(".contact-actions__menu"), "aria-label", "Contact et téléchargement", "Contact and download"],
  [document.querySelector(".language-switcher"), "aria-label", "Choisir la langue", "Choose language"]
];

function setLanguage(language, persist = true) {
  const lang = language === "en" ? "en" : "fr";

  textNodes.forEach((textNode) => {
    const french = originalText.get(textNode);
    const key = french.trim();
    const leading = french.match(/^\s*/)[0];
    const trailing = french.match(/\s*$/)[0];
    textNode.nodeValue = lang === "en" ? `${leading}${translations[key]}${trailing}` : french;
  });

  attributeTranslations.forEach(([element, attribute, french, english]) => {
    if (element) element.setAttribute(attribute, lang === "en" ? english : french);
  });

  document.documentElement.lang = lang;
  document.title = `Kevin Mulinda Bruce — ${lang === "en" ? "English CV" : "CV français"}`;

  document.querySelectorAll(".language-switcher button").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.lang === lang));
  });

  const pdf = document.querySelector("#pdf-download");
  const pdfName = `Kevin_Mulinda_Bruce_CV_${lang.toUpperCase()}.pdf`;
  pdf.href = pdfName;
  pdf.download = pdfName;

  const url = new URL(window.location.href);
  url.searchParams.set("lang", lang);
  history.replaceState(null, "", url);
  if (persist) localStorage.setItem("cv-language", lang);
}

document.querySelectorAll(".language-switcher button").forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang));
});

const requestedLanguage = new URLSearchParams(window.location.search).get("lang");
const initialLanguage = requestedLanguage || localStorage.getItem("cv-language") || "fr";
setLanguage(initialLanguage, false);
