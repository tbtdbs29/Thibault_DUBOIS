const express = require('express');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = Number(process.env.PORT || 3000);
const dataDir = process.env.RAILWAY_VOLUME_MOUNT_PATH || path.join(__dirname, 'data');
const uploadDir = path.join(dataDir, 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });
const db = new Database(path.join(dataDir, 'site.sqlite'));
db.pragma('journal_mode = WAL');
db.exec(`
  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT UNIQUE NOT NULL, title TEXT NOT NULL,
    excerpt TEXT NOT NULL DEFAULT '', body TEXT NOT NULL DEFAULT '', cover_image TEXT NOT NULL DEFAULT '',
    seo_title TEXT NOT NULL DEFAULT '', seo_description TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'draft',
    published_at TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT, path TEXT NOT NULL, referrer TEXT NOT NULL DEFAULT '',
    user_agent TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT NOT NULL, number TEXT NOT NULL, customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL, total_cents INTEGER NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'draft',
    data TEXT NOT NULL DEFAULT '{}', stripe_session_id TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
  );
`);

app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  if (!process.env.STRIPE_WEBHOOK_SECRET) return res.status(503).end();
  const Stripe = require('stripe');
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  let event;
  try { event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET); } catch (error) { return res.status(400).send(`Webhook Error: ${error.message}`); }
  if (event.type === 'checkout.session.completed') db.prepare("UPDATE documents SET status = 'paid', updated_at = ? WHERE stripe_session_id = ?").run(now(), event.data.object.id);
  res.json({ received: true });
});
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'change-this-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 8 * 60 * 60 * 1000 }
}));
app.use('/uploads', express.static(uploadDir));
app.use(express.static(__dirname, { index: 'index.html' }));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false }));

const now = () => new Date().toISOString();
const slugify = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 90);
const adminPassword = () => process.env.ADMIN_PASSWORD || '';
const starterArticles = [
  {
    slug: 'pourquoi-creer-un-site-web-pour-son-activite',
    title: 'Pourquoi créer un site web pour son activité ?',
    excerpt: 'Un site web professionnel aide à être trouvé, rassurer ses prospects et présenter clairement ses services.',
    body: '<p>Un site web est souvent le premier point de contact entre une entreprise et un futur client. Il permet de présenter votre activité à toute heure, avec vos mots et votre identité.</p><h2>Être visible au bon moment</h2><p>Un site optimisé pour le référencement naturel peut apparaître lorsque vos clients recherchent précisément vos services. Il complète les réseaux sociaux, dont les publications sont rapidement remplacées.</p><h2>Rassurer et faciliter le contact</h2><p>Des informations claires, des réalisations et un formulaire simple donnent confiance. Le visiteur sait qui vous êtes, ce que vous proposez et comment vous joindre.</p><h2>Un outil qui évolue</h2><p>Un site peut commencer simplement puis accueillir un blog, un agenda, un espace client ou un back-office au fil du développement de votre activité.</p>',
    seo: 'Création de site web professionnel : pourquoi se lancer ?'
  },
  {
    slug: 'chatbot-personnalise-pour-entreprise',
    title: 'Chatbot personnalisé : à quoi sert-il pour une entreprise ?',
    excerpt: 'Un chatbot adapté à votre activité peut répondre aux questions fréquentes et qualifier les demandes, sans déshumaniser la relation.',
    body: '<p>Un chatbot personnalisé ne se limite pas à répondre avec des phrases génériques. Il est configuré autour de vos prestations, de votre vocabulaire et des questions réelles de vos clients.</p><h2>Répondre immédiatement</h2><p>Horaires, tarifs indicatifs, zones d’intervention ou étapes d’un projet peuvent être expliqués même lorsque vous êtes indisponible.</p><h2>Qualifier les demandes</h2><p>Le chatbot peut recueillir les informations utiles avant un échange : type de projet, budget, délai et coordonnées. Vous gagnez du temps sans perdre le contact humain.</p><h2>Un accompagnement encadré</h2><p>Les réponses importantes doivent rester vérifiables et le visiteur doit toujours pouvoir demander un contact direct. L’objectif est d’aider, pas de remplacer votre expertise.</p>',
    seo: 'Chatbot personnalisé pour entreprise : usages et avantages'
  },
  {
    slug: 'ux-ui-difference-experience-interface',
    title: 'UX et UI : comprendre la différence pour un site plus efficace',
    excerpt: 'L’UX et l’UI travaillent ensemble pour rendre un site agréable, compréhensible et simple à utiliser.',
    body: '<p>UX signifie expérience utilisateur et UI signifie interface utilisateur. Ces deux disciplines sont complémentaires, mais elles ne désignent pas la même chose.</p><h2>L’UX organise le parcours</h2><p>L’UX cherche à comprendre les besoins, structurer les contenus et réduire les hésitations. Un bon parcours permet de trouver une information ou réaliser une action sans effort inutile.</p><h2>L’UI rend l’interface lisible</h2><p>L’UI concerne les couleurs, la typographie, les espacements, les boutons et les états visuels. Une interface cohérente aide l’utilisateur à comprendre ce qui est possible.</p><h2>Le résultat compte plus que l’effet</h2><p>Un design réussi ne cherche pas seulement à impressionner. Il guide, rassure et reste confortable sur mobile comme sur ordinateur.</p>',
    seo: 'UX UI : différences et conseils pour un site web efficace'
  },
  {
    slug: 'hebergement-nom-domaine-email-professionnel',
    title: 'Hébergement, nom de domaine et email professionnel : les bases',
    excerpt: 'Comprendre ces trois éléments permet de lancer un site fiable et de présenter une image professionnelle.',
    body: '<p>Un projet web repose sur plusieurs briques souvent confondues : le nom de domaine, l’hébergement et l’adresse email professionnelle.</p><h2>Le nom de domaine</h2><p>C’est l’adresse que les visiteurs saisissent pour accéder au site. Elle doit être simple à retenir, cohérente avec votre activité et renouvelée chaque année.</p><h2>L’hébergement</h2><p>L’hébergement stocke les fichiers et fait fonctionner le site. Une solution comme Railway permet de déployer une application avec une base de données et des variables sécurisées.</p><h2>L’adresse email</h2><p>Une adresse liée au domaine renforce la confiance dans les échanges commerciaux. Elle peut être configurée avec le fournisseur adapté à vos besoins.</p>',
    seo: 'Hébergement, nom de domaine et email professionnel : guide'
  }
];
const insertStarterArticle = db.prepare('INSERT OR IGNORE INTO articles (slug, title, excerpt, body, seo_title, seo_description, status, published_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
starterArticles.forEach((article) => {
  const timestamp = now();
  insertStarterArticle.run(article.slug, article.title, article.excerpt, article.body, article.seo, article.excerpt, 'published', timestamp, timestamp, timestamp);
});
function requireAdmin(req, res, next) {
  if (req.session.admin) return next();
  return res.status(401).json({ error: 'Authentification requise' });
}
function documentNumber(type) {
  const prefix = type === 'invoice' ? 'FAC' : 'DEV';
  const year = new Date().getFullYear();
  const count = db.prepare('SELECT COUNT(*) AS count FROM documents WHERE type = ?').get(type).count + 1;
  return `${prefix}-${year}-${String(count).padStart(4, '0')}`;
}

app.get('/health', (req, res) => res.json({ ok: true, service: 'thibault-dubois' }));
app.post('/api/send-quote', async (req, res) => {
  const body = req.body || {};
  const email = String(body.email || '').trim();
  if (!String(body.nom || '').trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !String(body.type_projet || '').trim() || !String(body.description || '').trim()) return res.status(400).json({ error: 'missing_or_invalid_fields' });
  const timestamp = now();
  db.prepare('INSERT INTO documents (type, number, customer_name, customer_email, total_cents, data, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .run('quote', documentNumber('quote'), String(body.nom).slice(0, 200), email.slice(0, 200), 0, JSON.stringify({ source: 'formulaire de contact', ...body }), 'request', timestamp, timestamp);
  try {
    const handler = require('./api/send-quote');
    await handler(req, res);
  } catch (error) {
    console.error('[send-quote] error', error.message);
    if (!res.headersSent) res.status(500).json({ error: 'internal_error' });
  }
});
app.post('/api/chat', async (req, res) => {
  try { return await require('./api/chat')(req, res); } catch (error) { console.error('[chat] error', error.message); return res.status(500).json({ error: 'internal_error' }); }
});
app.post('/api/analytics', (req, res) => {
  const page = String(req.body.path || '/').slice(0, 300);
  db.prepare('INSERT INTO visits (path, referrer, user_agent, created_at) VALUES (?, ?, ?, ?)')
    .run(page, String(req.body.referrer || '').slice(0, 500), String(req.get('user-agent') || '').slice(0, 500), now());
  res.status(204).end();
});

app.get('/api/articles', (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(12, Math.max(1, Number(req.query.limit) || 6));
  const offset = (page - 1) * limit;
  const items = db.prepare("SELECT id, slug, title, excerpt, cover_image, published_at FROM articles WHERE status = 'published' ORDER BY published_at DESC LIMIT ? OFFSET ?").all(limit, offset);
  const total = db.prepare("SELECT COUNT(*) AS count FROM articles WHERE status = 'published'").get().count;
  res.json({ items, page, pages: Math.max(1, Math.ceil(total / limit)), total });
});
app.get('/api/articles/:slug', (req, res) => {
  const article = db.prepare("SELECT * FROM articles WHERE slug = ? AND status = 'published'").get(req.params.slug);
  if (!article) return res.status(404).json({ error: 'Article introuvable' });
  res.json(article);
});

app.post('/api/admin/login', async (req, res) => {
  if (!adminPassword()) return res.status(503).json({ error: 'ADMIN_PASSWORD doit être configuré sur Railway' });
  const configured = adminPassword();
  const valid = configured.startsWith('$2') ? await bcrypt.compare(String(req.body.password || ''), configured) : String(req.body.password || '') === configured;
  if (!valid) return res.status(401).json({ error: 'Mot de passe incorrect' });
  req.session.admin = true;
  res.json({ ok: true });
});
app.post('/api/admin/logout', (req, res) => req.session.destroy(() => res.json({ ok: true })));
app.get('/api/admin/me', requireAdmin, (req, res) => res.json({ authenticated: true }));
app.get('/api/admin/stats', requireAdmin, (req, res) => {
  const totalVisits = db.prepare('SELECT COUNT(*) AS count FROM visits').get().count;
  const todayVisits = db.prepare("SELECT COUNT(*) AS count FROM visits WHERE created_at >= date('now')").get().count;
  const articles = db.prepare('SELECT COUNT(*) AS count FROM articles').get().count;
  const documents = db.prepare('SELECT COUNT(*) AS count FROM documents').get().count;
  const revenue = db.prepare("SELECT COALESCE(SUM(total_cents), 0) AS cents FROM documents WHERE type = 'invoice' AND status = 'paid'").get().cents;
  const daily = db.prepare("SELECT substr(created_at, 1, 10) AS day, COUNT(*) AS visits FROM visits WHERE created_at >= date('now', '-29 days') GROUP BY day ORDER BY day").all();
  res.json({ totalVisits, todayVisits, articles, documents, revenueCents: revenue, daily });
});

app.get('/api/admin/articles', requireAdmin, (req, res) => res.json(db.prepare('SELECT * FROM articles ORDER BY updated_at DESC').all()));
app.post('/api/admin/articles', requireAdmin, (req, res) => {
  const title = String(req.body.title || '').trim();
  if (!title) return res.status(400).json({ error: 'Le titre est obligatoire' });
  const timestamp = now();
  const slug = slugify(req.body.slug || title);
  try {
    const result = db.prepare(`INSERT INTO articles (slug, title, excerpt, body, cover_image, seo_title, seo_description, status, published_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(slug, title, String(req.body.excerpt || ''), String(req.body.body || ''), String(req.body.cover_image || ''), String(req.body.seo_title || title), String(req.body.seo_description || req.body.excerpt || ''), req.body.status === 'published' ? 'published' : 'draft', req.body.status === 'published' ? timestamp : null, timestamp, timestamp);
    res.status(201).json(db.prepare('SELECT * FROM articles WHERE id = ?').get(result.lastInsertRowid));
  } catch (error) { res.status(409).json({ error: 'Ce slug existe déjà' }); }
});
app.put('/api/admin/articles/:id', requireAdmin, (req, res) => {
  const current = db.prepare('SELECT * FROM articles WHERE id = ?').get(req.params.id);
  if (!current) return res.status(404).json({ error: 'Article introuvable' });
  const status = req.body.status === 'published' ? 'published' : 'draft';
  const publishedAt = status === 'published' ? (current.published_at || now()) : null;
  db.prepare(`UPDATE articles SET slug = ?, title = ?, excerpt = ?, body = ?, cover_image = ?, seo_title = ?, seo_description = ?, status = ?, published_at = ?, updated_at = ? WHERE id = ?`)
    .run(slugify(req.body.slug || req.body.title), String(req.body.title || ''), String(req.body.excerpt || ''), String(req.body.body || ''), String(req.body.cover_image || ''), String(req.body.seo_title || req.body.title || ''), String(req.body.seo_description || req.body.excerpt || ''), status, publishedAt, now(), req.params.id);
  res.json(db.prepare('SELECT * FROM articles WHERE id = ?').get(req.params.id));
});
app.delete('/api/admin/articles/:id', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM articles WHERE id = ?').run(req.params.id);
  res.status(204).end();
});

const upload = multer({ storage: multer.diskStorage({ destination: uploadDir, filename: (req, file, cb) => cb(null, `${Date.now()}-${slugify(path.parse(file.originalname).name)}${path.extname(file.originalname).toLowerCase()}`) }), limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (req, file, cb) => cb(null, /^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) });
app.post('/api/admin/uploads', requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Image JPEG, PNG, WebP ou GIF requise' });
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
});

app.get('/api/admin/documents', requireAdmin, (req, res) => res.json(db.prepare('SELECT * FROM documents ORDER BY created_at DESC').all().map((item) => ({ ...item, data: JSON.parse(item.data) }))));
app.post('/api/admin/documents', requireAdmin, (req, res) => {
  const type = req.body.type === 'invoice' ? 'invoice' : 'quote';
  const customerName = String(req.body.customer_name || '').trim();
  const customerEmail = String(req.body.customer_email || '').trim();
  const totalCents = Math.round(Number(req.body.total || 0) * 100);
  if (!customerName || !customerEmail || totalCents < 0) return res.status(400).json({ error: 'Client, email et montant requis' });
  const timestamp = now();
  const data = JSON.stringify({ lines: Array.isArray(req.body.lines) ? req.body.lines : [], notes: String(req.body.notes || '') });
  const result = db.prepare('INSERT INTO documents (type, number, customer_name, customer_email, total_cents, data, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(type, documentNumber(type), customerName, customerEmail, totalCents, data, timestamp, timestamp);
  res.status(201).json(db.prepare('SELECT * FROM documents WHERE id = ?').get(result.lastInsertRowid));
});
app.post('/api/admin/documents/:id/payment-link', requireAdmin, async (req, res) => {
  if (!process.env.STRIPE_SECRET_KEY) return res.status(503).json({ error: 'STRIPE_SECRET_KEY doit être configurée sur Railway' });
  const document = db.prepare('SELECT * FROM documents WHERE id = ?').get(req.params.id);
  if (!document) return res.status(404).json({ error: 'Document introuvable' });
  const Stripe = require('stripe');
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const checkout = await stripe.checkout.sessions.create({ mode: 'payment', customer_email: document.customer_email, line_items: [{ price_data: { currency: 'eur', product_data: { name: `${document.type === 'invoice' ? 'Facture' : 'Devis'} ${document.number}` }, unit_amount: document.total_cents }, quantity: 1 }], success_url: `${process.env.PUBLIC_URL || ''}/paiement.html?success=1`, cancel_url: `${process.env.PUBLIC_URL || ''}/paiement.html?cancelled=1`, metadata: { document_id: String(document.id) } });
  db.prepare('UPDATE documents SET stripe_session_id = ?, status = ?, updated_at = ? WHERE id = ?').run(checkout.id, 'sent', now(), document.id);
  res.json({ url: checkout.url });
});
app.post('/api/admin/documents/:id/send', requireAdmin, async (req, res) => {
  if (!process.env.RESEND_API_KEY || !process.env.SEND_FROM_EMAIL) return res.status(503).json({ error: 'RESEND_API_KEY et SEND_FROM_EMAIL doivent être configurées sur Railway' });
  const document = db.prepare('SELECT * FROM documents WHERE id = ?').get(req.params.id);
  if (!document) return res.status(404).json({ error: 'Document introuvable' });
  const kind = document.type === 'invoice' ? 'facture' : 'devis';
  const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: process.env.SEND_FROM_EMAIL, to: [document.customer_email], reply_to: process.env.CONTACT_EMAIL, subject: `${kind[0].toUpperCase() + kind.slice(1)} ${document.number}`, html: `<p>Bonjour ${document.customer_name},</p><p>Vous trouverez votre ${kind} <strong>${document.number}</strong> d'un montant de <strong>${(document.total_cents / 100).toFixed(2)} €</strong>.</p><p>Merci,<br>Thibault Dubois</p>` }) });
  if (!response.ok) return res.status(502).json({ error: 'Envoi email impossible' });
  db.prepare("UPDATE documents SET status = 'sent', updated_at = ? WHERE id = ?").run(now(), document.id);
  res.json({ ok: true });
});
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'admin', 'index.html')));
app.listen(port, () => console.log(`Railway server listening on port ${port}`));
