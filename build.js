// Genera el sitio estático en ./public (se ejecuta en Render: `node build.js`)
const fs = require('fs');
const path = require('path');

const SITE = (process.env.SITE_URL || 'https://certificados-redecora.onrender.com').replace(/\/$/, '');
const GAME = process.env.GAME_URL || 'https://atlas-terrenos.onrender.com';
const SB_URL = process.env.SUPABASE_URL || 'https://frwkzishfcrebjuwcisq.supabase.co';
// Clave pública (anon): es segura en el navegador porque la tabla usa RLS.
const SB_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyd2t6aXNoZmNyZWJqdXdjaXNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM0MzQ3MTAsImV4cCI6MjEwOTAxMDcxMH0.VwXkuQU3XaHk7Z9HX4mLfadLjZ8Fu7TVsNAQ8CGnfkw';

const WORLDS = [
  { slug: 'luna',        name: 'la Luna',        title: 'Luna',        emoji: '🌕', c1: '#e5e7eb', c2: '#6b7280', desc: 'Un cráter tranquilo, sin vecinos ruidosos y con vistas a la Tierra.' },
  { slug: 'marte',       name: 'Marte',          title: 'Marte',       emoji: '🔴', c1: '#fb923c', c2: '#9a3412', desc: 'El planeta rojo: valles gigantes, volcanes enormes y atardeceres azules.' },
  { slug: 'mercurio',    name: 'Mercurio',       title: 'Mercurio',    emoji: '⚫', c1: '#d6d3d1', c2: '#57534e', desc: 'El más cercano al Sol: un año dura solo 88 días terrestres.' },
  { slug: 'venus',       name: 'Venus',          title: 'Venus',       emoji: '🟡', c1: '#fde68a', c2: '#b45309', desc: 'El planeta más brillante del cielo, envuelto en nubes doradas.' },
  { slug: 'jupiter',     name: 'Júpiter',        title: 'Júpiter',     emoji: '🟠', c1: '#fdba74', c2: '#9a5b2b', desc: 'El gigante del sistema solar, con una tormenta que dura siglos.' },
  { slug: 'saturno',     name: 'Saturno',        title: 'Saturno',     emoji: '🪐', c1: '#fcd34d', c2: '#a16207', desc: 'Una parcela con los anillos más famosos como paisaje.' },
  { slug: 'urano',       name: 'Urano',          title: 'Urano',       emoji: '🔵', c1: '#67e8f9', c2: '#0e7490', desc: 'El planeta que gira tumbado de lado, helado y turquesa.' },
  { slug: 'neptuno',     name: 'Neptuno',        title: 'Neptuno',     emoji: '🌀', c1: '#60a5fa', c2: '#1e3a8a', desc: 'El último gigante: azul profundo y vientos supersónicos.' },
  { slug: 'pluton',      name: 'Plutón',         title: 'Plutón',      emoji: '🤍', c1: '#fbcfe8', c2: '#78350f', desc: 'El pequeño rincón del borde del sistema solar, con su corazón de hielo.' },
  { slug: 'prehistoria', name: 'la Prehistoria', title: 'Prehistoria', emoji: '🦖', c1: '#86efac', c2: '#365314', desc: 'Un terreno junto a los dinosaurios, hace millones de años.' },
];

const OUT = path.join(__dirname, 'public');
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'c'), { recursive: true });

const read = (f) => fs.readFileSync(path.join(__dirname, 'src', f), 'utf8');
const write = (f, s) => { fs.mkdirSync(path.dirname(path.join(OUT, f)), { recursive: true }); fs.writeFileSync(path.join(OUT, f), s); };

write('style.css', read('style.css'));
write('app.js', read('app.js'));
write('config.js', 'window.CFG=' + JSON.stringify({ sbUrl: SB_URL, sbKey: SB_KEY, game: GAME, site: SITE, worlds: WORLDS }) + ';');

const head = ({ title, desc, url, noindex }) => `<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${url}">
${noindex ? '<meta name="robots" content="noindex,follow">' : ''}
<meta property="og:type" content="website"><meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}"><meta property="og:url" content="${url}">
<meta name="twitter:card" content="summary">
<link rel="stylesheet" href="/style.css"></head><body>`;

const foot = `<footer class="foot"><p>Certificado simbólico y de entretenimiento, sin valor legal ni de propiedad real.
Los terrenos que sí puedes reclamar están en <a href="${GAME}" rel="noopener">Atlas Terrenos</a>.</p></footer>
<script src="/config.js"></script><script src="/app.js"></script></body></html>`;

const others = (cur) => `<nav class="grid" aria-label="Otros mundos">${WORLDS.filter(w => w.slug !== cur).map(w =>
  `<a class="card" href="/${w.slug}/" style="--c1:${w.c1};--c2:${w.c2}"><span>${w.emoji}</span><b>${w.title}</b></a>`).join('')}</nav>`;

// Home
write('index.html', head({
  title: 'Certificado de terreno en la Luna, Marte y más | Redecora',
  desc: 'Escribe tu nombre y obtén gratis un certificado simbólico de terreno en la Luna, Marte, Júpiter y otros 7 mundos. Compártelo con tus amigos.',
  url: SITE + '/',
}) + `<main class="wrap"><h1>Consigue tu certificado de terreno en otro mundo</h1>
<p class="lead">Elige un mundo, escribe tu nombre y recibe al instante un certificado gratis para compartir.</p>
<nav class="grid big" aria-label="Mundos">${WORLDS.map(w =>
  `<a class="card" href="/${w.slug}/" style="--c1:${w.c1};--c2:${w.c2}"><span>${w.emoji}</span><b>${w.title}</b><small>${w.desc}</small></a>`).join('')}</nav>
<section class="cta"><h2>¿Y si pudieras reclamar un terreno de verdad?</h2>
<p>En Atlas Terrenos puedes reclamar parcelas en la Tierra, la Luna, Marte y mucho más.</p>
<a class="btn" href="${GAME}" rel="noopener">Jugar a Atlas Terrenos</a></section></main>` + foot);

// Páginas por mundo
for (const w of WORLDS) {
  write(`${w.slug}/index.html`, head({
    title: `Certificado de terreno en ${w.name} gratis | Redecora`,
    desc: `Consigue gratis tu certificado de terreno en ${w.name}. ${w.desc} Escribe tu nombre y compártelo.`,
    url: `${SITE}/${w.slug}/`,
  }) + `<main class="wrap" style="--c1:${w.c1};--c2:${w.c2}">
<p class="emoji">${w.emoji}</p><h1>Certificado de terreno en ${w.name}</h1>
<p class="lead">${w.desc} Escribe tu nombre y obtén tu certificado al instante.</p>
<form id="f" class="form" data-mundo="${w.slug}">
<label for="nombre">Tu nombre</label>
<input id="nombre" name="nombre" maxlength="40" minlength="2" required autocomplete="name" placeholder="Ej.: Ana García">
<button class="btn" type="submit">Obtener mi certificado</button>
<p id="msg" class="msg" role="alert"></p></form>
<section class="text"><h2>¿Qué es este certificado?</h2>
<p>Es un diploma simbólico y divertido que acredita que tienes una parcela imaginaria en ${w.name}.
Puedes compartir el enlace, imprimirlo o regalarlo. No tiene valor legal.</p></section>
<section class="cta"><h2>Reclama un terreno de verdad en el juego</h2>
<p>En Atlas Terrenos puedes jugar y reclamar parcelas en ${w.name} y en otros mundos.</p>
<a class="btn" href="${GAME}" rel="noopener">Ir a Atlas Terrenos</a></section>
<h2>Otros mundos</h2>${others(w.slug)}</main>` + foot);
}

// Página del certificado (/c/?id=xxxx)
write('c/index.html', head({
  title: 'Tu certificado de terreno | Redecora',
  desc: 'Certificado simbólico de terreno en otro mundo. Consigue el tuyo gratis.',
  url: SITE + '/c/', noindex: true,
}) + `<main class="wrap">
<p id="status" class="lead">Cargando certificado…</p>
<article id="cert" class="cert" hidden>
<div class="seal" id="c-emoji"></div>
<p class="kicker">Certificado de terreno</p>
<h1 id="c-mundo"></h1>
<p>Se certifica, de forma simbólica, que</p>
<p class="name" id="c-nombre"></p>
<p>es propietario/a de una parcela imaginaria en este mundo.</p>
<p class="meta"><span id="c-id"></span> · <span id="c-fecha"></span></p></article>
<div id="actions" class="actions" hidden>
<button class="btn" id="b-share" type="button">Compartir</button>
<button class="btn alt" id="b-copy" type="button">Copiar enlace</button>
<a class="btn alt" id="b-wa" target="_blank" rel="noopener">WhatsApp</a>
<button class="btn alt" id="b-print" type="button">Imprimir / PDF</button></div>
<section class="cta"><h2>Reclama tu terreno de verdad</h2>
<p>Este certificado es simbólico. En Atlas Terrenos puedes jugar y reclamar parcelas reales del juego.</p>
<a class="btn" href="${GAME}" rel="noopener">Jugar a Atlas Terrenos</a></section>
<h2>Consigue tu certificado en otro mundo</h2>${others('')}</main>` + foot);

// SEO
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  ['/', ...WORLDS.map(w => `/${w.slug}/`)].map(u => `<url><loc>${SITE}${u}</loc></url>`).join('\n') + `\n</urlset>\n`);
write('robots.txt', `User-agent: *\nAllow: /\nDisallow: /c/\nSitemap: ${SITE}/sitemap.xml\n`);

console.log('OK: ' + (WORLDS.length + 2) + ' páginas generadas');
