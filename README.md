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

1. **Nom de domaine** : remplacez `https://www.thibault-dubois.dev` par votre vrai domaine dans toutes les balises `<link rel="canonical">`, `og:url`, `sitemap.xml` et `robots.txt` (recherche/remplace global).
2. **Mentions légales** (`mentions-legales.html`) : complétez les champs `[...]` (adresse complète, numéro SIRET, email professionnel, hébergeur) — obligatoire légalement pour une activité d'auto-entrepreneur en France.
3. **Image de partage (Open Graph)** : ajoutez une vraie image (`assets/img/og-image.jpg`, 1200×630px) et référencez-la dans les balises `og:image` de chaque page pour un meilleur rendu au partage sur les réseaux sociaux.
4. **Adresse email de contact** : dans `mentions-legales.html`, renseignez votre email professionnel (ne pas utiliser un email d'employeur pour une activité freelance).

## Déploiement (recommandé : Vercel)

Le site est un mélange de fichiers statiques + fonctions serverless (`/api`), ce que Vercel gère nativement sans configuration.

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
