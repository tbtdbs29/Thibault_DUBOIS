# Guide avant lancement — Thibault Dubois

Ce document est une feuille de route pratique pour lancer une activité de développement web en France et mettre le site en production. Il ne remplace pas un conseil personnalisé d'un expert-comptable, de l'Urssaf ou d'un juriste. Les règles, seuils et tarifs peuvent évoluer : vérifie les informations sur les sites officiels avant de prendre une décision.

## Situation de départ

Tu n'as pas encore de client. C'est une situation normale : tu peux préparer ton activité, ton offre, ton site et tes outils avant le premier contrat. Tu ne déclares pas de chiffre d'affaires que tu n'as pas encaissé. En revanche, certaines démarches doivent être faites avant de facturer.

Le statut le plus simple à étudier pour démarrer seul est généralement la **micro-entreprise** (entrepreneur individuel au régime micro), mais ce n'est pas automatiquement le meilleur choix dans tous les cas. Compare avec une entreprise individuelle au réel ou une société si tu prévois beaucoup de frais, des associés, des investissements importants ou une croissance rapide.

## Les sites officiels à consulter

- [Guichet unique des formalités](https://formalites.entreprises.gouv.fr/) : création ou modification de l'activité.
- [Urssaf auto-entrepreneur](https://www.autoentrepreneur.urssaf.fr/) : déclarations, cotisations, calendrier et attestations.
- [Entreprendre Service Public](https://entreprendre.service-public.fr/) : obligations, facturation, CFE et démarches.
- [Impots.gouv.fr professionnel](https://www.impots.gouv.fr/professionnel) : impôts, TVA, espace professionnel et CFE.
- [INPI](https://data.inpi.fr/) : vérifier les informations publiques de l'entreprise et les formalités.
- [CNIL](https://www.cnil.fr/) : RGPD, cookies, formulaires, prospection et durée de conservation.
- [Service-Public.fr](https://www.service-public.fr/) : droit de rétractation, médiation et contrats avec des particuliers.
- [Stripe](https://dashboard.stripe.com/register) : compte de paiement et vérification d'identité.
- [Resend](https://resend.com/) : envoi des emails transactionnels.
- [Railway](https://railway.com/) : hébergement du serveur et de la base.
- [Google Search Console](https://search.google.com/search-console) : suivi de l'indexation.
- [Google Business Profile](https://www.google.com/business/) : visibilité locale, si ton activité et ton adresse sont éligibles.

## Étape 1 — Clarifier l'activité

Avant de créer l'entreprise, écris précisément ce que tu vas vendre :

- création de sites vitrines ;
- applications web et back-office ;
- maintenance et évolutions ;
- conseil UX/UI ;
- chatbots personnalisés ;
- configuration de domaine, email et hébergement ;
- création de devis, factures ou outils métier ;
- accompagnement SEO si tu le proposes réellement.

Choisis une activité principale cohérente avec ce que tu feras le plus souvent. Ne présente pas une activité comme de l'hébergement revendu si tu ne fais que configurer un compte chez un fournisseur : distingue clairement ton accompagnement technique et le coût du fournisseur.

## Étape 2 — Choisir le statut

### Micro-entreprise : option de départ à étudier

Elle est souvent adaptée pour tester une activité de service avec peu de frais fixes. Les démarches sont relativement simples et les cotisations sont calculées sur le chiffre d'affaires encaissé.

Points à comprendre avant de choisir :

- tu ne déduis pas tes dépenses réelles comme dans un régime au réel ;
- les seuils de chiffre d'affaires et de TVA doivent être vérifiés chaque année ;
- tu dois déclarer même un chiffre d'affaires nul ;
- tu dois tenir un livre des recettes et conserver tes factures ;
- la CFE peut devenir due selon ta situation ;
- le régime de TVA doit apparaître correctement sur tes factures.

### Quand demander un avis professionnel

Demande un rendez-vous à un expert-comptable si tu prévois : beaucoup de matériel, de sous-traitance, de logiciels payants, de publicité, un associé, des clients étrangers, une activité importante ou un chiffre d'affaires qui approche des seuils.

## Étape 3 — Faire la déclaration

1. Va sur le [guichet unique](https://formalites.entreprises.gouv.fr/).
2. Prépare une pièce d'identité et tes informations personnelles.
3. Décris l'activité de développement informatique et les services réellement proposés.
4. Choisis la date de début d'activité.
5. Vérifie le régime fiscal et social proposé.
6. Conserve l'accusé de dépôt et les documents reçus.
7. Attends ton numéro SIREN/SIRET avant de finaliser tes documents commerciaux.
8. Crée ton espace Urssaf et ton espace professionnel impots.gouv.fr.

Ne choisis pas une date de début fictive pour obtenir un numéro plus vite. Les conséquences administratives et fiscales dépendent de cette date.

## Étape 4 — Banque et organisation financière

Ouvre au minimum un espace bancaire dédié à l'activité si cela devient nécessaire dans ton cas, et sépare dès le début les flux personnels et professionnels. Utilise un compte professionnel si ta banque, ton activité ou ton niveau de chiffre d'affaires le justifie.

Mets en place :

- un dossier `Recettes` ;
- un dossier `Dépenses` ;
- un dossier `Devis` ;
- un dossier `Factures` ;
- un export mensuel de la base et des PDF ;
- une sauvegarde hors Railway ;
- un tableau de suivi du chiffre d'affaires encaissé.

Le serveur stocke SQLite dans `/data` sur Railway, mais un volume n'est pas une stratégie de sauvegarde complète. Teste régulièrement la restauration.

## Étape 5 — Préparer les documents légaux

Avant de vendre, complète [mentions-legales.html](mentions-legales.html) avec :

- nom et statut exact ;
- adresse professionnelle ;
- SIRET ;
- email professionnel ;
- hébergeur réel et adresse de l'hébergeur ;
- régime de TVA ;
- informations RGPD ;
- modalités d'exercice des droits.

Prépare également des **CGV** adaptées à tes clients. Elles doivent préciser les prestations, prix, délais, validation, paiement, retards, propriété intellectuelle, maintenance, annulation, responsabilité et livraison. Si tu travailles avec des particuliers, traite aussi le droit de rétractation et la médiation de la consommation avec un professionnel compétent.

## Étape 6 — Configurer le domaine et Railway

### Domaine

1. Achète un domaine chez un registrar reconnu.
2. Active le renouvellement automatique seulement si tu contrôles le moyen de paiement.
3. Configure les DNS indiqués par Railway.
4. Vérifie HTTPS et les redirections avec et sans `www`.
5. Ne mets jamais les identifiants du registrar dans GitHub.

### Railway

1. Crée un projet depuis le dépôt GitHub.
2. Déploie le service Node avec `npm start`.
3. Ajoute un volume monté sur `/data`.
4. Ajoute les variables de `.env.example`.
5. Vérifie `https://ton-domaine.fr/health`.
6. Vérifie `/admin` et le login.
7. Vérifie que la base reste présente après un redéploiement.
8. Limite l'accès aux logs et aux variables aux personnes nécessaires.

Variables minimales :

```env
PUBLIC_URL=https://ton-domaine.fr
SESSION_SECRET=une-valeur-aleatoire-longue
ADMIN_PASSWORD=un-mot-de-passe-fort
RAILWAY_VOLUME_MOUNT_PATH=/data
```

## Étape 7 — Configurer les emails avec Resend

1. Crée un compte Resend.
2. Ajoute ton domaine d'envoi.
3. Ajoute les enregistrements DNS SPF et DKIM fournis par Resend.
4. Configure une adresse d'envoi professionnelle.
5. Renseigne :

```env
RESEND_API_KEY=...
CONTACT_EMAIL=ton-adresse-de-reception@example.com
SEND_FROM_EMAIL=contact@ton-domaine.fr
```

6. Teste le formulaire de contact.
7. Teste un nouveau commentaire.
8. Teste une réponse à un commentaire avec une adresse email.
9. Vérifie les spams et les logs Resend.

N'utilise pas `onboarding@resend.dev` en production si tu peux vérifier ton propre domaine.

## Étape 8 — Configurer Stripe et envoyer une demande de règlement

Le back office possède une action **Demander le règlement** sur les factures. Elle crée une Checkout Session Stripe, enregistre son identifiant, puis envoie au client un email Resend avec un bouton de paiement.

### Créer Stripe

1. Crée ton compte sur [Stripe Dashboard](https://dashboard.stripe.com/register).
2. Active le mode test au début.
3. Complète les informations de l'entreprise et l'identité demandées.
4. Renseigne le compte bancaire destiné aux versements.
5. En mode test, utilise uniquement les clés `sk_test_...` et `pk_test_...`.
6. Ne partage jamais la clé secrète.

Variables Railway :

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PUBLIC_URL=https://ton-domaine.fr
```

### Configurer le webhook

Dans Stripe, crée un endpoint :

```text
https://ton-domaine.fr/api/stripe/webhook
```

Écoute au minimum l'événement :

```text
checkout.session.completed
```

Copie le secret de signature `whsec_...` dans `STRIPE_WEBHOOK_SECRET`. Le statut de la facture devient `paid` uniquement après ce webhook signé.

### Tester avant production

1. Crée une facture test depuis `/admin`.
2. Clique sur **Demander le règlement**.
3. Vérifie que le client reçoit l'email.
4. Ouvre le lien Stripe.
5. Utilise une carte de test Stripe, par exemple `4242 4242 4242 4242` avec une date future et un CVC quelconque.
6. Vérifie que le webhook arrive.
7. Vérifie que la facture passe à `paid`.
8. Teste un paiement refusé et un paiement annulé.
9. Passe ensuite aux clés live seulement quand les tests sont concluants.

Ne marque jamais manuellement une facture comme payée depuis le navigateur et ne considère pas une simple redirection de succès comme une preuve de paiement.

## Étape 9 — Vérifier le site avant lancement

Checklist technique :

- toutes les pages s'ouvrent en HTTPS ;
- aucun `localhost` ou domaine de test dans les URLs ;
- `/health` répond correctement ;
- le formulaire de contact fonctionne ;
- le chatbot fonctionne ou affiche un fallback propre ;
- les emails arrivent ;
- `/admin` est protégé ;
- les factures PDF sont lisibles ;
- une demande Stripe test fonctionne ;
- le webhook met bien à jour le statut ;
- les articles sont accessibles et présents dans le sitemap ;
- le site fonctionne sur mobile ;
- les images ont un texte alternatif utile ;
- les mentions légales ne contiennent plus de crochets `[ ... ]` ;
- la base et les uploads sont sauvegardés.

## Étape 10 — Déclarer le chiffre d'affaires

Après le premier encaissement :

1. note la date et le montant encaissé ;
2. conserve la facture et la preuve de paiement ;
3. déclare le chiffre d'affaires à l'Urssaf selon la périodicité choisie ;
4. mets de côté les sommes nécessaires aux cotisations et impôts ;
5. rapproche Stripe, la banque et ton registre de recettes ;
6. conserve tes documents pendant la durée légale applicable.

Un devis ou une facture non payée ne doit pas être confondu avec un encaissement. En cas de doute sur la TVA, les clients étrangers ou les prestations récurrentes, demande un avis professionnel.

## Ce que tu dois payer au départ

Prévois au minimum :

- nom de domaine : généralement facturé à l'année ;
- Railway : hébergement et volume selon l'usage et le plan ;
- Resend : selon le volume d'emails ;
- Stripe : frais sur les paiements, selon les conditions du compte ;
- éventuellement une adresse email professionnelle ;
- éventuellement un expert-comptable ou un accompagnement juridique ;
- éventuellement assurance responsabilité civile professionnelle ;
- cotisations et taxes liées à l'activité après les encaissements et selon ta situation.

Les montants exacts changent. Consulte les tarifs officiels avant de t'engager.

## Ordre conseillé pour toi

1. Finaliser l'offre et les tarifs.
2. Vérifier le statut micro-entreprise ou demander un avis professionnel.
3. Faire la déclaration si nécessaire.
4. Obtenir SIRET/SIREN.
5. Choisir le nom de domaine.
6. Compléter les mentions légales et les CGV.
7. Créer Railway et ajouter le volume `/data`.
8. Créer Resend et vérifier le domaine email.
9. Créer Stripe en mode test.
10. Configurer le webhook.
11. Tester devis, facture, email, commentaire et paiement.
12. Faire les sauvegardes.
13. Mettre le site en production.
14. Commencer la prospection et ne déclarer que les encaissements réels.

## Feu vert de lancement

Tu peux considérer le projet techniquement prêt lorsque le site, le back office, les emails, les PDF, Stripe et les sauvegardes ont tous été testés. Tu peux considérer l'activité commercialement prête uniquement lorsque ton statut, tes mentions légales, tes CGV, ton régime de TVA et tes obligations administratives sont vérifiés.
