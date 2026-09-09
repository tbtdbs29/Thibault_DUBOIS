# Guide avant lancement — Thibault Dubois

Je ne suis ni expert-comptable ni avocat : tout ce qui suit est ma meilleure compréhension du sujet, pas un conseil juridique ou fiscal engageant. Les montants et seuils cités sont ceux en vigueur au moment de la rédaction et **changent régulièrement** — vérifie-les sur les sites officiels avant de t'engager, en particulier tout ce qui touche à la TVA (voir plus bas, le sujet a beaucoup bougé récemment). Pour tout doute réel sur ta situation, un rendez-vous (souvent gratuit, une heure) avec un expert-comptable ou la CCI/CMA de ton secteur vaut mieux que n'importe quel guide générique.

## Où tu en es

Tu n'as pas encore de statut légal, pas encore de client, et le site est presque prêt techniquement. C'est une bonne position : tu peux finir de préparer sans pression. Un point à corriger vite cela dit — **ton site présente déjà publiquement "Auto-entrepreneur" comme ton statut** (page "À propos") alors qu'il n'existe pas encore légalement. Tant que tu n'as pas de SIRET, retire cette mention ou remplace-la par "Futur auto-entrepreneur" / "En cours d'immatriculation" : tu ne peux pas facturer, ni te présenter comme tel, avant l'immatriculation.

Autre point de contexte important que l'ancien guide n'abordait pas : tu es **salarié en informatique en parallèle**. Ça change deux ou trois choses sur le plan légal (voir juste en dessous) et ça vaut le coup d'y penser avant de te déclarer, pas après.

## Le statut : ce que je te conseille, et pourquoi

**Mon conseil : micro-entreprise, régime BNC (bénéfices non commerciaux), pour démarrer.** Raisons concrètes :

- Tu factures du temps et de la compétence, pas de la marchandise : peu de charges déductibles réelles (pas de stock, pas de local, matériel limité à un ordinateur). Le régime réel ne t'apporterait pas grand-chose tant que tes frais restent bas — la micro-entreprise devient moins intéressante surtout quand tu as beaucoup de frais à déduire (matériel lourd, sous-traitance, bureau loué).
- C'est réversible : tu peux basculer vers une société (EURL, SASU) plus tard si l'activité grossit, sans avoir perdu de temps à monter une structure trop lourde pour un début d'activité à temps partiel.
- Démarches et comptabilité minimalistes (un livre des recettes suffit), ce qui compte quand tu as déjà un emploi à côté.

**Ce que la micro-entreprise implique concrètement :**

- Tu cotises sur ce que tu encaisses réellement, pas sur ce que tu factures. Rien d'encaissé = rien à déclarer, mais tu dois quand même déclarer "0" à chaque échéance.
- Cotisations sociales : environ 21 % du chiffre d'affaires encaissé pour une activité BNC de prestation de service (ordre de grandeur — vérifie le taux exact sur autoentrepreneur.urssaf.fr, il évolue). Tu peux demander l'**ACRE** (aide aux créateurs) lors de l'immatriculation, qui réduit ces cotisations sur les premiers mois si tu es éligible — demande-la dès le formulaire de création, elle n'est pas automatique.
- Seuil de chiffre d'affaires pour rester en micro-BNC : de l'ordre de 77 000 € par an (seuil revalorisé tous les 3 ans). Loin de toi pour l'instant, mais garde-le en tête si l'activité décolle.
- **TVA — à vérifier absolument avant de facturer.** Le seuil de franchise en base pour les prestations de service tournait autour de 37 500 €/an. Une réforme votée fin 2024 prévoyait de baisser ce seuil à 25 000 € pour tout le monde à partir de mars 2025 ; elle a été suspendue sous la pression des indépendants, mais je ne peux pas te garantir l'état exact du dossier aujourd'hui. **Vérifie ce point précis sur impots.gouv.fr avant d'émettre ta première facture** : ça détermine si tu factures "TTC net de TVA" (mention "TVA non applicable, art. 293 B du CGI") ou si tu dois facturer et reverser la TVA dès le départ.
- Impôt sur le revenu : par défaut, un abattement forfaitaire de 34 % s'applique sur ton chiffre d'affaires BNC avant intégration à ton revenu imposable. Il existe une option de "versement libératoire" (un pourcentage fixe du CA payé chaque mois/trimestre, qui solde l'impôt) — **mais elle n'est ouverte que si le revenu fiscal de référence de ton foyer reste sous un plafond**. Comme tu as déjà un salaire, additionne les deux revenus avant de choisir : dans pas mal de cas, avec un salaire confortable en plus du freelance, cette option n'est plus avantageuse ou plus accessible. Fais le calcul (ou fais-le faire) avant de cocher la case sur le formulaire de création.

**Le point spécifique "salarié + freelance" à vérifier avant de te lancer :**

- Relis ton contrat de travail : cherche une **clause d'exclusivité** ou de **non-concurrence**. Une clause d'exclusivité est en principe suspendue de droit pendant la première année d'une micro-entreprise (article L1222-5 du Code du travail), mais tu dois quand même **en informer ton employeur** si une telle clause existe dans ton contrat.
- Même sans clause, tu as un **devoir de loyauté** envers ton employeur : ne travaille pas sur ton activité freelance sur ton temps de travail, avec son matériel, ou pour des clients qui seraient directement concurrents de son activité.
- Aucune obligation légale de prévenir ton employeur si ton contrat ne contient aucune clause d'exclusivité — mais en pratique, beaucoup de gens le font pour éviter tout malentendu, surtout quand les deux activités touchent au même domaine (le tien : informatique des deux côtés).

**Code d'activité (APE/NAF) à indiquer lors de la déclaration** : très probablement 6201Z (programmation informatique) ou 6202A (conseil en systèmes informatiques) selon comment tu décris ton activité principale — le guichet unique te le proposera automatiquement à partir de ta description.

## Le parcours avant de chercher tes premiers clients

Dans l'ordre, sans redite :

1. **Vérifie ton contrat de travail** (clause d'exclusivité / non-concurrence) — voir ci-dessus. C'est la seule étape qui peut tout remettre en cause, fais-la en premier.
2. **Décide du statut** (micro-entreprise BNC, sauf si le rendez-vous avec un comptable te dit autrement) et du régime fiscal (versement libératoire ou non, en tenant compte de ton salaire).
3. **Immatricule-toi** sur [formalites.entreprises.gouv.fr](https://formalites.entreprises.gouv.fr/) : pièce d'identité, description réelle de l'activité (site web, applications, chatbots, maintenance — ce que tu proposes vraiment sur `services.html`), date de début choisie sciemment (pas une date arbitraire), demande d'ACRE si éligible. Tu reçois ton SIRET quelques jours/semaines après.
4. **Ouvre un espace bancaire dédié** à l'activité (obligatoire si ton CA dépasse 10 000 €/an sur deux années consécutives, mais autant séparer dès le début pour t'y retrouver).
5. **Retire ou corrige la mention "Auto-entrepreneur"** sur le site tant que le SIRET n'est pas obtenu (voir plus haut).
6. **Complète les mentions légales et rédige des CGV** — c'est le plus gros chantier restant, détaillé plus bas. Ne saute pas cette étape : c'est ce qui te protège en cas de litige, et c'est ce qu'un client un minimum sérieux va vérifier.
7. **Souscris une assurance RC Pro** (responsabilité civile professionnelle) — voir plus bas, non-obligatoire pour ton activité mais fortement recommandée.
8. **Configure le domaine, l'email pro, Resend puis Stripe** (détails ci-dessous), teste chaque brique une par une.
9. **Fais un tour complet du site en conditions réelles** : formulaire de contact, devis, facture PDF, envoi d'email, commentaire d'article, demande de paiement Stripe test, `/admin`, `/health`, responsive mobile. La liste complète est plus bas.
10. **Commence la prospection.** Ne déclare que ce que tu encaisses réellement — un devis accepté n'est pas un encaissement.

## Infrastructure : domaine, email pro, hébergement et clés API

Tu veux tout centraliser pour pouvoir héberger aussi les sites de tes futurs clients sur le même compte. Voici comment je m'y prendrais, dans l'ordre, et pourquoi.

### 1. Le nom de domaine (le tien)

Achète-le chez un registrar sérieux — OVHcloud ou Gandi (français, bon support, gèrent bien le `.fr`) sont de bons choix pour démarrer ; Cloudflare Registrar est une alternative correcte si tu veux le prix coûtant, mais le support est en anglais uniquement. Vu ta cible bretonne, un `.fr` peut renforcer un peu la confiance locale ; le `.dev` déjà présent dans le code (`thibault-dubois.dev`) fonctionne très bien aussi.

1. Vérifie la disponibilité du nom voulu.
2. Achète-le, active la protection WHOIS (généralement gratuite et automatique en Europe, RGPD oblige).
3. Ne branche le renouvellement automatique que sur un moyen de paiement que tu surveilles activement.

### 2. L'hébergement — Railway, un compte, un service par site

Le projet est déjà pensé pour Railway (`railway.toml`). Pour ton objectif d'y héberger aussi les sites clients, voici la structure que je recommande :

- Passe (ou crée) une **Team Railway** plutôt qu'un compte personnel brut : facturation centralisée sur une seule carte, mais structure d'outil professionnel dès le départ plutôt qu'un compte perso qui s'alourdit projet après projet.
- **Un service Railway séparé par site**, y compris pour chaque futur client — jamais deux sites dans le même processus Node. Chaque service a ses propres variables d'environnement (les clés API d'un client ne peuvent donc jamais fuiter vers un autre), son propre nom de domaine, ses propres logs, et un bug ou un pic de trafic chez l'un n'affecte pas les autres. Railway facture à l'usage : multiplier les services ne coûte quasiment rien tant que le trafic reste modeste, donc rien ne justifie de mutualiser plusieurs sites dans un seul service pour "économiser".
- Chaque service peut avoir son propre domaine personnalisé (Railway > Settings > Domains) : `ton-domaine.fr` et `site-du-client.fr` peuvent chacun pointer vers leur propre service, sur le même compte.

**Un point à trancher maintenant plutôt que plus tard : qui possède le nom de domaine d'un client ?** Le plus sain : **le client achète et reste titulaire de son propre domaine**, toi tu configures seulement les DNS pour pointer vers le service Railway que tu gères pour lui. Si un jour la collaboration s'arrête, le client garde son domaine et n'est l'otage de personne. Si tu préfères gérer l'achat pour lui simplifier la vie, mets bien **le client comme titulaire (registrant) dans le WHOIS**, jamais toi.

### 3. L'email professionnel

Deux choses à ne pas confondre :
- **Resend** (déjà dans ton code) envoie des emails automatiques (devis, notifications) — ce n'est pas une boîte mail, tu ne peux ni y répondre ni la consulter.
- Il te faut en plus une **vraie boîte mail** (`contact@ton-domaine.fr`) pour échanger avec tes clients au quotidien.

Options, du moins cher au plus complet :
- **OVH/Gandi Mail** (quelques euros/mois, parfois quasi inclus avec le domaine) — suffisant pour démarrer.
- **Infomaniak** — bon rapport qualité/prix, orienté vie privée, populaire chez les indépendants en France.
- **Google Workspace** (~6-7 €/mois) — interface Gmail familière, pratique si tu veux Agenda/Drive partagés plus tard.

**Piège technique à connaître avant de tout configurer** : ta boîte mail et Resend vont tous les deux vouloir écrire un enregistrement **SPF** sur le même domaine — or un domaine ne peut avoir qu'**un seul enregistrement SPF**. Si tu en crées deux, tes emails partent en spam. Il faut fusionner les deux dans une seule ligne (ex. `v=spf1 include:mail-provider.com include:spf.resend.com ~all`). Fais cette étape en dernier, une fois les deux comptes créés, en une seule fois plutôt qu'en deux temps.

### 4. Les clés API à récupérer

| Service | Sert à | Où la récupérer |
|---|---|---|
| Railway | Hébergement | Dashboard Railway > variables d'environnement du service |
| Resend | Emails transactionnels | resend.com > API Keys, après vérification du domaine |
| Anthropic (Claude) | Le chatbot | console.anthropic.com > API Keys |
| Stripe | Paiements | dashboard.stripe.com > Développeurs > Clés API (détail juste en dessous) |

Toutes ces clés vont dans les variables d'environnement du service Railway concerné — jamais dans le code, jamais sur GitHub.

### 5. Pour plus tard, une fois plusieurs clients hébergés

- Tiens un tableau (même une simple feuille) : par client, nom de domaine, registrar, service Railway associé, date de renouvellement, comptes tiers utilisés. Sans ça, tu perds vite le fil dès le 3e ou 4e client.
- Active une alerte de dépenses dans Railway (Settings > Usage) pour ne pas être surpris par la facture à mesure que tu ajoutes des services.

## Checklist de configuration — `tdubois.fr` est acheté, voici la suite

Le domaine est pris, avec Zimbra pour l'email. J'ai déjà mis à jour le code (`index.html`, `services.html`, `a-propos.html`, `contact.html`, `mentions-legales.html`, `cgv.html`, `sitemap.xml`, `robots.txt`) pour remplacer l'ancien domaine placeholder par `www.tdubois.fr`. Voici tout ce qu'il te reste à faire, dans l'ordre.

### A. DNS chez le registrar de tdubois.fr

- [ ] Ajouter l'enregistrement pointant vers Railway (valeur exacte donnée par Railway à l'étape B — fais B avant de finir A).
- [ ] Vérifier que les MX Zimbra sont bien en place (souvent déjà configurés automatiquement si Zimbra vient du même registrar que le domaine — vérifie quand même).
- [ ] Ne touche à rien d'autre tant que Resend (étape C) n'a pas donné ses propres enregistrements — tu les ajouteras tous en une fois pour éviter les allers-retours DNS.

### B. Railway

- [ ] Dans le service Railway existant : Settings > Domains > ajouter `tdubois.fr` et `www.tdubois.fr` (choisis lequel est la version canonique, l'autre redirige vers).
- [ ] Variables d'environnement à vérifier/ajouter :
  ```env
  PUBLIC_URL=https://www.tdubois.fr
  SESSION_SECRET=une-valeur-aléatoire-longue
  ADMIN_PASSWORD=un-mot-de-passe-fort
  RAILWAY_VOLUME_MOUNT_PATH=/data
  ```
- [ ] Une fois le DNS propagé, vérifie `https://www.tdubois.fr/health`.

### C. Resend (emails automatiques — devis, commentaires)

- [ ] Compte sur [resend.com](https://resend.com/).
- [ ] Ajouter le domaine `tdubois.fr`, récupérer les enregistrements SPF/DKIM proposés.
- [ ] **Fusionner le SPF avec celui de Zimbra en un seul enregistrement TXT** (piège déjà signalé plus haut — deux enregistrements SPF séparés cassent la délivrabilité). Le DKIM, lui, s'ajoute normalement sans conflit (enregistrement séparé).
- [ ] Récupérer la clé API, l'ajouter dans Railway : `RESEND_API_KEY=...`
- [ ] Définir `SEND_FROM_EMAIL=contact@tdubois.fr` (ou l'adresse Zimbra que tu veux utiliser pour l'envoi automatique).
- [ ] Définir `CONTACT_EMAIL=...` (l'adresse Zimbra où tu veux recevoir les demandes de devis et les notifications de commentaires).
- [ ] Teste : formulaire de contact, puis un commentaire sur un article.

### D. Anthropic (chatbot)

- [ ] Compte sur [console.anthropic.com](https://console.anthropic.com/).
- [ ] Ajoute un moyen de paiement — c'est de la facturation à l'usage (au token), pas un abonnement fixe ; les montants restent faibles pour le trafic d'un site qui démarre, mais surveille quand même la conso au début.
- [ ] Génère une clé API (Settings > API Keys), ajoute-la dans Railway : `ANTHROPIC_API_KEY=...`
- [ ] `MODEL_NAME` : laisse `claude-opus-5` (qualité maximale, déjà en valeur par défaut) ou passe à `claude-sonnet-5`/`claude-haiku-4-5` si tu veux réduire les coûts dès le départ.
- [ ] Teste le chatbot directement sur le site.

### E. Stripe (paiements) — détail complet juste en dessous, résumé ici pour la checklist

- [ ] Compte sur [dashboard.stripe.com/register](https://dashboard.stripe.com/register), reste en **mode test**.
- [ ] Récupère `sk_test_...`, ajoute-le dans Railway : `STRIPE_SECRET_KEY=...`
- [ ] Crée le webhook `https://www.tdubois.fr/api/stripe/webhook`, événement `checkout.session.completed`, récupère `whsec_...` : `STRIPE_WEBHOOK_SECRET=...`
- [ ] Teste une facture + la carte test `4242 4242 4242 4242`.
- [ ] Une fois validé : complète le profil Stripe (IBAN, identité), puis seulement bascule en clés `sk_live_...` / webhook live.

### F. Une fois tout branché — mettre à jour le contenu du site

- [ ] `mentions-legales.html` : les `[...]` restants (adresse, email désormais réel avec `@tdubois.fr`, hébergeur = Railway).
- [ ] `cgv.html` : idem.
- [ ] Vérifie qu'aucune URL `localhost` ne traîne nulle part avant la mise en production.

## Comprendre et activer Stripe

Tu m'as dit ne jamais l'avoir utilisé — voici ce que c'est et comment ça marche, en clair.

**Stripe, en une phrase** : c'est l'intermédiaire qui prend la carte bancaire de ton client, sécurise le paiement, et vire l'argent sur ton compte bancaire pro quelques jours après (moins ses frais, autour de 1,5 % + 0,25 € par paiement en carte européenne — vérifie le tarif exact dans ton dashboard, il dépend du type de carte). Tu n'as jamais accès au numéro de carte du client : Stripe s'en charge, c'est ce qui te dispense de la plupart des obligations de sécurité type PCI-DSS.

**Ce qui existe déjà dans ton back-office** (j'ai vérifié le code et testé le parcours en local, ça fonctionne) : sur une facture, le bouton **"Demander le règlement"** fait ceci automatiquement :

1. Crée une session de paiement Stripe ("Checkout Session") au montant TTC de la facture.
2. Enregistre l'identifiant de cette session sur la facture, et passe son statut à `sent`.
3. Envoie un email au client (via Resend) avec un bouton "Régler en ligne" qui pointe vers la page de paiement Stripe.
4. Quand le client paie, Stripe appelle ton serveur en coulisses (le "webhook") qui repasse automatiquement la facture au statut `paid` — **c'est la seule façon dont une facture passe à "payée"**, il n'y a pas de bouton pour le faire manuellement, et c'est volontaire : ça évite qu'une facture soit marquée payée sans preuve réelle.

**Comment l'activer, étape par étape :**

1. Crée un compte sur [dashboard.stripe.com/register](https://dashboard.stripe.com/register). Reste en **mode test** au début (bascule visible en haut du dashboard) — en mode test, aucun vrai paiement n'a lieu, tu peux tout essayer sans risque.
2. Dans **Développeurs > Clés API**, récupère la clé secrète de test (`sk_test_...`). Ne la partage jamais, ne la mets jamais dans le code ni sur GitHub — uniquement dans les variables d'environnement Railway.
3. Ajoute sur Railway :
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   PUBLIC_URL=https://ton-domaine.fr
   ```
4. Toujours dans le dashboard Stripe (mode test), va dans **Développeurs > Webhooks**, ajoute un endpoint : `https://ton-domaine.fr/api/stripe/webhook`, coche au minimum l'événement `checkout.session.completed`. Stripe te donne un secret `whsec_...` à ce moment-là — c'est celui à mettre dans `STRIPE_WEBHOOK_SECRET`.
5. Teste : crée une facture test dans `/admin`, clique "Demander le règlement", ouvre le lien reçu par email, paie avec la carte de test `4242 4242 4242 4242` (date future, CVC quelconque). Vérifie que la facture passe bien à `paid` dans `/admin` après quelques secondes.
6. Teste aussi un paiement refusé (carte de test `4000 0000 0000 0002`) et un abandon de paiement, pour voir comment le statut se comporte dans ces cas.
7. Une fois que tout ça fonctionne, complète ton profil Stripe (infos entreprise, IBAN de versement, vérification d'identité — Stripe te guide, ça peut prendre quelques jours à valider). Ce n'est qu'une fois ce profil validé que tu peux basculer en clés **live** (`sk_live_...`, nouveau webhook en mode live avec son propre `whsec_...`) et recevoir de vrais paiements.

Petit bug que j'ai corrigé au passage pendant que je regardais ce code : `admin/index.html` contenait deux fois la même fonction JavaScript `loadDocuments` (un reliquat probable d'un ancien copier-coller), la deuxième écrasant la première sans casser rien de visible, mais c'était du code mort à nettoyer. C'est fait.

## Ce qu'il manque encore côté légal

Par ordre d'importance :

1. **Les CGV n'existaient pas du tout — j'ai créé un modèle** (`cgv.html`, lié depuis le footer de toutes les pages). C'était le plus gros trou légal du site. Le modèle couvre devis/acompte, délais, paiement, pénalités de retard (taux légal + indemnité forfaitaire de 40 € pour frais de recouvrement, obligatoires dès que tu factures des professionnels), propriété intellectuelle, garantie, résiliation, responsabilité. **Reste à compléter** : les champs entre crochets (statut juridique, SIRET, délais exacts), et surtout à désigner un vrai **médiateur de la consommation** (inscription à faire, coordonnées à indiquer) — obligatoire dès ta première vente à un particulier (loi Hamon), et actuellement resté en placeholder dans le modèle. Fais relire l'ensemble par un professionnel avant publication, ce n'est qu'une base de travail.
2. **`mentions-legales.html` contient encore des `[...]` à remplacer** : adresse complète, SIRET (tu ne l'as pas encore, normal), email professionnel, nom et adresse de l'hébergeur réel (Railway — regarde leurs mentions légales pour la raison sociale exacte à citer). Ne mets rien en ligne avec des crochets visibles.
3. **Assurance responsabilité civile professionnelle (RC Pro)** : non-obligatoire légalement pour du développement web, mais fortement conseillée. Si un bug que tu livres cause une perte de données ou de chiffre d'affaires chez un client, tu es responsable sur tes biens propres en micro-entreprise (pas de séparation patrimoniale automatique totale comme en société). Une RC Pro freelance tech coûte en général quelques centaines d'euros par an.
4. **La mention "Auto-entrepreneur" affichée publiquement avant l'immatriculation** (déjà signalé plus haut) — à corriger dès maintenant, pas seulement "avant lancement".
5. Le reste (RGPD, cookies) est en fait plutôt bien traité dans les mentions légales actuelles : pas de cookies publicitaires, préférence de thème en local uniquement, formulaire de contact avec une phrase claire sur l'usage des données. Un point à surveiller : la table `visits` en base stocke le user-agent complet sans limite de durée de conservation définie — ajoute une purge automatique (par exemple au-delà de 13 mois, la durée généralement admise par la CNIL pour ce type de mesure d'audience) plutôt que de tout garder indéfiniment.

## Ce qu'il manque encore côté technique/pratique

**Corrigé aujourd'hui, pendant que je regardais le site** (détail dans mon message, pas la peine de le refaire) :

- Le header de `blog.html` ("Articles" dans le menu) n'avait ni bouton thème clair/sombre, ni menu mobile, ni suivi de visites — la page n'incluait tout simplement pas `assets/js/main.js`. C'est corrigé, avec un footer complet aligné sur le reste du site.
- `mentions-legales.html` n'avait pas le lien "Articles" dans son menu, et un footer minimaliste différent des autres pages. Aligné aussi.
- Aucune page 404 personnalisée : un lien cassé affichait l'erreur brute d'Express ("Cannot GET ..."). Ajout d'une page `404.html` à l'image du site avec des liens de retour.
- Doublon de code dans `admin/index.html` (voir section Stripe).
- Les vignettes d'articles sur `blog.html` avaient un `alt=""` vide au lieu du titre de l'article (mauvais pour l'accessibilité et le SEO) — corrigé pour reprendre le titre. `article.html` le faisait déjà correctement en JS, pas de souci de ce côté.
- Page CGV créée (voir "Ce qu'il manque encore côté légal").
- Le bouton thème clair/sombre sur `article.html` utilisait un caractère "◐" fixe qui ne changeait jamais d'apparence, alors que partout ailleurs c'est une icône lune/soleil qui bascule selon le thème actif — d'où l'impression d'un header "pas tout à fait pareil" même après la correction de `blog.html`. Aligné sur le même système d'icônes SVG que le reste du site.
- Le site débordait horizontalement (scroll latéral involontaire) sur deux plages de largeur réelles : les tablettes en portrait (environ 720 à 830px de large — iPad, la plupart des tablettes Android), où le menu complet ne rentrait plus mais le menu hamburger n'apparaissait pas encore ; et les petits téléphones (moins de 400px de large), où le logo, le bouton thème et le bouton "Devis gratuit" ne tenaient plus sur une seule ligne. Corrigé : le menu hamburger apparaît maintenant plus tôt (dès 900px), et le bouton "Devis gratuit" du header se masque sous 400px de large (il reste accessible en un clic via le menu mobile).
- **Bug plus sérieux sur le schéma de la page d'accueil** (le cercle "</>" et ses étiquettes flottantes) : il débordait et se retrouvait à moitié masqué sur quasiment toutes les tailles d'écran de bureau/laptop courantes (1200 à 1800px de large, donc y compris un MacBook 14"), à cause d'un piège classique de CSS Grid — la colonne ne pouvait pas rétrécir sous la taille minimale de son contenu et débordait du conteneur de la page. Le premier correctif a supprimé le débordement mais a fait apparaître un second effet de bord : le bloc pouvait alors chevaucher le texte à gauche (ex. l'étiquette "Chatbot personnalisé" par-dessus "applications sur-mesure"), à cause d'une hauteur minimale fixe qui l'empêchait de vraiment épouser la largeur de sa colonne. Corrigé en profondeur (le bloc suit maintenant strictement la largeur de sa colonne, sur desktop comme sur mobile), revérifié sur 24 largeurs d'écran (280 à 2560px) et sur toutes les pages sans aucune régression sur le menu, le header sticky ou l'affichage mobile.

**Encore à faire, par priorité :**

1. `sitemap.xml` est statique et ne liste que 4 pages (accueil, prestations, à propos, contact) — ni `blog.html`, ni aucun des 8 articles publiés, qui sont pourtant le cœur de ta stratégie SEO. Comme les articles vivent en base et pas en fichiers statiques, le plus robuste serait une route serveur qui génère le sitemap dynamiquement à partir de la table `articles`, plutôt qu'un fichier figé à mettre à jour à la main à chaque nouvel article.
2. Image Open Graph (`og:image`) toujours absente d'après le README — sans elle, un lien partagé sur LinkedIn/réseaux sociaux n'affiche pas de visuel, ce qui réduit nettement les clics.
3. `blog.html` n'a plus le chatbot (je l'ai volontairement laissé de côté en corrigeant le header : le widget demande tout un bloc de markup qui n'existait pas sur cette page, l'ajouter à la légère aurait juste chargé un script inutile). À toi de décider si tu veux le chatbot sur la page articles aussi, ou si tu préfères la garder plus sobre pour la lecture — les deux se défendent.
4. Teste réellement une restauration de sauvegarde SQLite avant d'en avoir besoin en urgence : un volume Railway n'est pas un plan de sauvegarde en soi.
5. Vérifie ton domaine d'envoi Resend (au lieu de `onboarding@resend.dev`) avant la mise en production, pour la délivrabilité et la crédibilité de tes emails.

**Checklist finale avant de publier :**

- HTTPS partout, aucune URL `localhost` ou de test qui traîne
- `/health` répond
- Formulaire de contact, chatbot, commentaires d'article testés
- `/admin` protégé par un vrai mot de passe fort (ou hash bcrypt)
- PDF de devis/facture lisibles, demande de paiement Stripe testée de bout en bout (voir section Stripe)
- Webhook Stripe vérifié en conditions réelles (pas juste "ça a l'air de marcher")
- Mentions légales sans crochets, CGV publiées et liées depuis le footer
- Site testé sur mobile (menu, formulaires, boutons)
- Sauvegarde de la base testée en restauration, pas seulement en export

## Feu vert de lancement

Techniquement prêt : site, back-office, emails, PDF, Stripe et sauvegardes testés de bout en bout.
Commercialement prêt : statut immatriculé, mentions légales complètes, CGV publiées, régime de TVA vérifié, clause de ton contrat de travail vérifiée.

Les deux doivent être vrais en même temps avant la première facture — le reste (perfectionner le design, ajouter des articles, affiner le chatbot) peut continuer après le lancement.
