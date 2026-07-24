# Site vitrine ABG Digital Solutions — FR / EN

Site statique (HTML/CSS/JS, aucune base de données, aucun framework) prêt à être déposé tel quel sur un hébergement mutualisé OVH.

## Structure des fichiers

```
/
├── index.html          → page d'accueil FRANÇAIS (racine du site)
├── en/
│   └── index.html      → page d'accueil ENGLISH
├── assets/
│   ├── css/style.css
│   ├── js/main.js
│   └── favicon.svg
├── robots.txt
├── sitemap.xml
├── .htaccess            → règles Apache (HTTPS, www, cache, compression)
├── 404.html
└── README.md            → ce fichier
```

## 1. Déploiement sur OVH (hébergement mutualisé)

1. Connectez-vous à votre espace **OVH Manager** → *Hébergements* → votre hébergement web.
2. Récupérez vos identifiants **FTP/SFTP** (onglet « FTP-SSH »), ou utilisez le **gestionnaire de fichiers** intégré.
3. Avec un client FTP (FileZilla, Cyberduck…) ou SFTP, connectez-vous à votre hébergement.
4. Copiez **tout le contenu de ce dossier** (pas le dossier lui-même, son contenu) dans le répertoire racine `www/` de votre hébergement.
5. Vérifiez que le fichier `.htaccess` est bien transféré (certains clients FTP masquent les fichiers commençant par un point — activez l'affichage des fichiers cachés).
6. Associez votre nom de domaine à l'hébergement dans OVH Manager si ce n'est pas déjà fait (*Domaines* → *DNS* → zone déjà configurée par défaut si le domaine est chez OVH).
7. Activez le **certificat SSL Let's Encrypt gratuit** dans OVH Manager (*Hébergements* → *SSL/TLS*) — indispensable, le site est conçu pour tourner en HTTPS (`.htaccess` redirige automatiquement HTTP → HTTPS).

Le site sera alors accessible sur :
- `https://www.abgdigitalsolutions.com/` → version française
- `https://www.abgdigitalsolutions.com/en/` → version anglaise

## 2. Avant la mise en ligne — à personnaliser

Le contenu vient directement de votre plaquette. Quelques points à finaliser :

- **Nom de domaine réel** : remplacez `abgdigitalsolutions.com` par votre domaine définitif dans :
  - `index.html` et `en/index.html` (balises `canonical`, `hreflang`, Open Graph, JSON-LD)
  - `robots.txt` (ligne `Sitemap:`)
  - `sitemap.xml` (toutes les URLs)
- **Formulaire de contact** : il fonctionne actuellement en mode `mailto:` (ouvre le client mail du visiteur avec le message pré-rempli, adressé à `contact@abgdigitalsolutions.com`). Pour un vrai envoi silencieux depuis le formulaire (sans ouvrir le client mail du visiteur), deux options simples :
  - **Service tiers gratuit** type [Formspree](https://formspree.io) ou [OVH Mail](https://mail.ovh.com) : créez un point de terminaison, puis ajoutez `data-action-url="https://votre-endpoint"` sur `<form id="contact-form">` dans les deux pages — le JS bascule automatiquement en envoi silencieux (`fetch`) dès que cet attribut est présent.
  - **Script PHP côté OVH** (les hébergements OVH supportent PHP nativement) si vous préférez héberger vous-même le traitement du formulaire.
- **Adresse email de contact** : changez `contact@abgdigitalsolutions.com` (attribut `data-mailto`) par votre adresse réelle.
- **Image de partage réseaux sociaux** (`og:image`) : ajoutez une image `1200×630px` dans `assets/img/og-cover.jpg` et un logo dans `assets/img/logo.png` (référencés dans le JSON-LD).
- **Réseaux sociaux** : le tableau `sameAs` dans le JSON-LD (Organization) est vide — ajoutez vos liens LinkedIn/Instagram/etc. une fois créés, cela renforce le SEO.

## 3. SEO — ce qui est déjà en place

- Balises `title` et `meta description` uniques et optimisées par page/langue.
- Attributs `hreflang` réciproques FR ⇄ EN (bonne pratique Google pour le contenu multilingue).
- URL canonique par page.
- Open Graph + Twitter Card pour un aperçu soigné lors des partages (LinkedIn notamment, pertinent pour vos cibles institutionnelles).
- Données structurées **JSON-LD (schema.org/Organization)** pour aider Google à comprendre l'identité de l'entreprise.
- `sitemap.xml` avec alternates de langue, `robots.txt` pointant vers le sitemap.
- HTML sémantique (`header`, `main`, `section`, hiérarchie de titres `h1`→`h4` cohérente).
- Site 100 % statique = temps de chargement rapide, un critère de classement Google (Core Web Vitals).
- Police chargée via Google Fonts avec `preconnect` pour limiter l'impact sur la vitesse.

## 4. À faire après mise en ligne

1. Créer une **Google Search Console** et une **Bing Webmaster Tools**, y soumettre `sitemap.xml`.
2. Créer/relier un compte **Google Business Profile** pour votre présence locale (Abidjan).
3. Envisager un **Google Analytics 4** ou une alternative respectueuse de la vie privée (Plausible, Matomo) — non inclus par défaut pour rester léger et conforme RGPD sans bannière cookie superflue.
4. Ajouter progressivement des pages de contenu (études de cas, actualités) pour renforcer le SEO dans la durée — la structure actuelle en une page par langue peut évoluer vers plusieurs pages si vous le souhaitez.

## 5. Développement local

Aucune installation nécessaire. Pour prévisualiser localement, ouvrez simplement `index.html` dans un navigateur, ou lancez un petit serveur local (ex. `python3 -m http.server` depuis ce dossier) pour tester les chemins absolus (`/assets/...`) correctement.
