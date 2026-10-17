# Dorian Detailing

Site vitrine et back-office du centre de detailing Dorian Detailing (Braine-l'Alleud).

**Le site ne vend rien en ligne.** Aucune réservation de prestation, aucun paiement :
les clients consultent les formules et les tarifs, puis contactent l'atelier. Le
règlement se fait sur place. Le dashboard sert à gérer les prestations, leurs tarifs,
les options et les produits de la boutique.

## Stack

| | |
|---|---|
| Framework | Next.js 15 (App Router, Server Actions) |
| Langage | TypeScript |
| Styles | Tailwind CSS v4 |
| Base de données | PostgreSQL (Railway) via Prisma |
| Emails | Resend (notification des demandes de contact) |
| Auth admin | Session JWT signée (`jose`) dans un cookie httpOnly, mot de passe haché (bcrypt) |
| Hébergement | Vercel |

## Démarrage

```bash
npm install
cp .env.example .env     # puis renseigner les valeurs
npm run db:push          # crée les tables dans la base
npm run db:seed          # charge prestations, tarifs, options, produits + compte admin
npm run dev
```

Le site tourne sur http://localhost:3000, le dashboard sur http://localhost:3000/admin.

### Variables d'environnement

| Variable | Rôle |
|---|---|
| `DATABASE_URL` | Chaîne de connexion Postgres (onglet **Variables** du service Postgres sur Railway) |
| `AUTH_SECRET` | Clé de signature des sessions admin, 32 caractères minimum (`openssl rand -base64 32`) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Compte admin créé par le seed. À changer ensuite depuis **Réglages du site → Mot de passe** |
| `RESEND_API_KEY` | Clé API Resend. Sans elle, les demandes sont quand même enregistrées et visibles dans le dashboard |
| `CONTACT_FROM` | Expéditeur vérifié dans Resend |
| `CONTACT_TO` | Destinataire des demandes. Par défaut, l'email des réglages du site |

## Scripts

| Commande | Effet |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production (lance `prisma generate`) |
| `npm run db:push` | Applique le schéma Prisma à la base |
| `npm run db:seed` | (Re)charge les données initiales — idempotent, basé sur des `upsert` |
| `npm run db:studio` | Explorateur de base Prisma Studio |

## Données initiales

Le seed reprend fidèlement les sources fournies par le client :

- `Elite Detail.xlsx`, onglet **Dorian Detail** → les 11 prestations, leurs tarifs par
  gabarit (Citadine, Berline/Break, SUV, 7 places/Pick-up, Sportive), les promotions
  de la formule céramique, et les 10 options avec leur disponibilité par prestation ;
- `PRESTATION DORIAN DETAILING.pdf` → le détail « INCLUS » et la phrase d'accroche de
  chaque prestation.

Ces données sont dans `prisma/seed-data.ts`. Une fois le site en ligne, elles se
modifient depuis le dashboard, plus depuis ce fichier.

Les prix sont stockés **en centimes** (`Int`) pour éviter les erreurs d'arrondi.
Un prix absent (`null`) s'affiche « Sur devis ».

## Le dashboard

Accessible sur `/admin`, protégé par le middleware et revérifié côté serveur dans
chaque Server Action.

| Section | Permet de |
|---|---|
| **Prestations** | Créer/éditer une formule : accroche, liste des inclusions (une par ligne), tarif et promo par gabarit, options rattachées, mise en avant, publication |
| **Options** | Gérer les suppléments (shampoing sièges, ozone, céramique 12 mois…) et leur prix |
| **Produits** | Gérer la boutique vitrine : nom, rayon, description, contenance, prix indicatif, visuel |
| **Rayons boutique** | Les filtres de la page Boutique |
| **Avis clients** | Les témoignages affichés sur la page d'accueil |
| **Demandes** | Les messages reçus via le formulaire de contact, à marquer comme traités |
| **Réglages du site** | Coordonnées, horaires, réseaux sociaux, textes de la page d'accueil, mot de passe admin |

### Images produits

Deux façons de renseigner un visuel, dans le champ **Image** :

1. **Fichier dans le dépôt** — déposez l'image dans `public/produits/`, committez,
   déployez, puis saisissez son chemin : `/produits/cire.jpg`. **C'est la méthode à
   utiliser en production.**
2. **URL externe** — collez une URL complète (`https://…`).

Le bouton « Envoyer un fichier » écrit dans `public/uploads/` et **ne fonctionne qu'en
local** : sur Vercel le système de fichiers est en lecture seule à l'exécution, et le
bouton renvoie un message l'expliquant. Pour des envois d'images depuis le dashboard en
production, il faudrait brancher un stockage externe type Vercel Blob.

## Déploiement sur Vercel

1. Créer le projet Vercel depuis le dépôt Git.
2. Renseigner les variables d'environnement ci-dessus dans **Settings → Environment
   Variables**. `DATABASE_URL` doit être disponible **aussi au build** : les pages
   publiques sont pré-rendues et interrogent la base pendant `next build`.
3. Premier déploiement, puis, une seule fois, depuis votre machine pointée sur la base
   de production :
   ```bash
   npm run db:push
   npm run db:seed
   ```
4. Se connecter sur `/admin` et changer le mot de passe dans **Réglages du site**.

## Mise en cache

Les pages publiques sont en ISR (`revalidate = 300`). Chaque enregistrement dans le
dashboard appelle `revalidatePath` sur les pages concernées : les modifications
apparaissent immédiatement, sans attendre l'expiration du cache.

## À compléter

- Les **photos** : le hero de la page d'accueil et les vignettes produits affichent un
  bloc gris en attendant les visuels réels.
- Le **numéro d'entreprise (BCE)** dans les mentions légales.
- Les **liens réseaux sociaux**, à renseigner dans Réglages du site (les icônes sont
  masquées tant que les champs sont vides).
