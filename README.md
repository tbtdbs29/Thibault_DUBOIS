# Site de Thibault Dubois — Développeur Web Freelance

Site vitrine + chatbot IA pour la prise de devis, optimisé SEO (local : Brest / Hôpital-Camfrout / Finistère / Bretagne).

## Structure

```
index.html            Accueil
services.html          Détail des prestations + FAQ (schema.org)
a-propos.html          Parcours (BUT Informatique, double activité salarié/freelance)
contact.html           Formulaire de devis + infos de contact
mentions-legales.html  Mentions légales (À COMPLÉTER avant mise en ligne)
assets/css/style.css   Design system (clair/sombre, animations)
assets/js/main.js      Navigation, animations, formulaire de contact
assets/js/chatbot.js   Widget du chatbot
api/chat.js            Fonction serverless : chatbot IA (Anthropic API)
api/send-quote.js       Fonction serverless : envoi d'email de devis (Resend)
api/_lib/sendQuoteEmail.js  Logique d'envoi d'email partagée
```

Le site est en **HTML/CSS/JS statique pur** (aucun framework, aucun build) : c'est le meilleur choix pour le référencement (HTML immédiatement crawlable, temps de chargement minimal). Le chatbot IA appelle deux petites fonctions serverless (`/api/chat` et `/api/send-quote`) pour garder la clé API secrète côté serveur.

## Avant la mise en ligne

1. ~~**Nom de domaine**~~ Fait — le domaine `tdubois.fr` est en place dans les balises `<link rel="canonical">`, `og:url`, `sitemap.xml` et `robots.txt`.
2. **Mentions légales** (`mentions-legales.html`) : complétez les champs `[...]` (adresse complète, numéro SIRET, email professionnel, hébergeur) — obligatoire légalement pour une activité d'auto-entrepreneur en France.
3. **Image de partage (Open Graph)** : ajoutez une vraie image (`assets/img/og-image.jpg`, 1200×630px) et référencez-la dans les balises `og:image` de chaque page pour un meilleur rendu au partage sur les réseaux sociaux.
4. **Adresse email de contact** : dans `mentions-legales.html`, renseignez votre email professionnel (ne pas utiliser un email d'employeur pour une activité freelance).

## Déploiement historique (Vercel)

Cette procédure correspond à l'ancien mode serverless. Pour la version actuelle avec back office, SQLite et paiements, utilisez la procédure Railway ci-dessous.

1. Poussez ce dossier sur un dépôt GitHub (ex. sur votre compte [github.com/tbtdbs29](https://github.com/tbtdbs29)).
2. Sur [vercel.com](https://vercel.com), importez le dépôt (« Add New... > Project »). Aucune configuration de build n'est nécessaire.
3. Dans **Settings > Environment Variables**, ajoutez :
   - `ANTHROPIC_API_KEY` — clé API Anthropic ([console.anthropic.com](https://console.anthropic.com/)), nécessaire pour que le chatbot fonctionne.
   - `RESEND_API_KEY` — clé API [Resend](https://resend.com/) (gratuit jusqu'à 3000 emails/mois), pour que les devis soient envoyés par email.
   - `CONTACT_EMAIL` — l'adresse email sur laquelle vous voulez recevoir les demandes de devis.
   - `MODEL_NAME` (optionnel) — `claude-opus-5` par défaut. Pour réduire les coûts d'utilisation du chatbot, vous pouvez utiliser `claude-sonnet-5` (moins cher) ou `claude-haiku-4-5` (le moins cher).
4. Déployez. Votre site est en ligne, avec le chatbot fonctionnel.

**Sans configurer `ANTHROPIC_API_KEY`**, le site reste 100% utilisable : le chatbot affiche un message invitant à utiliser le formulaire de contact classique, qui fonctionne dès que `RESEND_API_KEY` et `CONTACT_EMAIL` sont configurés.

### Alternative : hébergement 100% statique (GitHub Pages, Netlify, etc.)

Vous pouvez héberger uniquement les fichiers HTML/CSS/JS (sans `/api`) sur n'importe quel hébergeur statique gratuit. Dans ce cas, le chatbot IA et l'envoi automatique de devis par email ne fonctionneront pas (ces hébergeurs n'exécutent pas de code serveur) — seul le formulaire de contact restera visible, sans envoi automatique. Vercel ou Netlify (avec Netlify Functions) sont recommandés pour profiter de toutes les fonctionnalités.

## Développement local

```bash
npm install
npm run dev        # sert les fichiers statiques sur http://localhost:3000
```

Pour tester le chatbot en local avec les fonctions serverless, installez la CLI Vercel :

```bash
npm i -g vercel
cp .env.example .env.local   # puis renseignez vos clés
vercel dev
```

## Personnalisation rapide

- **Couleurs / design** : variables CSS en haut de `assets/css/style.css` (`--color-primary`, `--gradient-brand`, etc.).
- **Ton et contenu du chatbot** : `SYSTEM_PROMPT` dans `api/chat.js`.
- **Contenu des pages** : chaque page est un fichier HTML indépendant, sans templating — modifiez directement le texte.

## SEO déjà en place

- Balises meta title/description uniques par page, Open Graph, Twitter Card.
- Données structurées schema.org : `ProfessionalService`, `Person`, `FAQPage`, `BreadcrumbList`, `Service` (visibles dans `<script type="application/ld+json">`).
- `sitemap.xml` et `robots.txt`.
- HTML sémantique, hiérarchie de titres correcte, site 100% responsive.
- Mots-clés locaux (Brest, Finistère, Bretagne, Hôpital-Camfrout) intégrés naturellement dans les contenus et métadonnées.
- Site rapide : aucune dépendance JS lourde, polices avec `font-display: swap`, images en lazy loading.

Pensez à créer/valider une fiche **Google Business Profile** (établissement local) : c'est ce qui influence le plus le référencement local une fois le site en ligne.

## Déploiement Railway et back office

Avant le lancement, consultez le [guide complet de lancement](GUIDE_AVANT_LANCEMENT.md), qui détaille les démarches administratives, la configuration Railway/Resend/Stripe, les tests et les obligations à vérifier.

Le projet peut désormais être déployé comme un service Node.js unique sur Railway. Le serveur écoute `PORT`, sert les pages statiques, expose les APIs publiques et protège le back office sur `/admin`.

1. Créez un service Railway depuis ce dépôt et ajoutez un volume persistant monté sur `/data`.
2. Configurez les variables de `.env.example`, au minimum `ADMIN_PASSWORD`, `SESSION_SECRET` et `RAILWAY_VOLUME_MOUNT_PATH=/data`.
3. Ajoutez `RESEND_API_KEY`, `CONTACT_EMAIL` et `SEND_FROM_EMAIL` pour l'envoi des demandes et documents.
4. Ajoutez `STRIPE_SECRET_KEY` et `STRIPE_WEBHOOK_SECRET` pour activer les liens de paiement. Le webhook Stripe doit pointer vers `/api/stripe/webhook`.
5. Ouvrez `https://votre-domaine.fr/admin` pour gérer les articles, les statistiques, les devis et les factures.

Le back office stocke les articles, visites et documents dans SQLite. Le volume Railway est indispensable pour conserver ces données lors des redéploiements. Les articles sont publiés via `/blog.html` et `/article.html?slug=...`, avec pagination automatique. Les images d'article sont stockées dans le volume et servies depuis `/uploads`.

Pour les paiements, le statut d'une facture passe à `paid` uniquement après réception d'un webhook Stripe signé. Pour la production, utilisez un mot de passe administrateur long, un `SESSION_SECRET` aléatoire et un domaine HTTPS.
