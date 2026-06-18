
## Objectif

Passer d'un parcours "configurateur direct" à un parcours "catalogue → produit → personnalisation", sans toucher au panier ni à Stripe. Preview uniquement, pas de publish.

## Navigation

Ajouter un header commun (composant `SiteHeader`) avec menu : **Accueil** (`/`), **Boutique** (`/boutique`), **À propos** (`/a-propos`) + icône panier.
- Retirer les CTAs actuels "Crée ton maillot" et "À propos" de la home.
- Header injecté dans `__root.tsx` (sous la promo banner) pour qu'il s'affiche sur toutes les pages.

## Routes

```
src/routes/
  index.tsx              -> homepage (nettoyée, on garde hero + éditorial, on retire le configurateur)
  boutique.tsx           -> catalogue produits (grille de cards)
  produit.$slug.tsx      -> page produit (galerie + description + bouton "Personnaliser")
  personnaliser.$slug.tsx-> configurateur existant pré-rempli avec le modèle choisi
  a-propos.tsx           -> inchangé
```

Le configurateur actuel (`src/routes/index.tsx`, étapes 1→3, panier, checkout) est **déplacé tel quel** vers `personnaliser.$slug.tsx`. On y ajoute juste la lecture du `slug` pour pré-sélectionner le modèle (forme du bas / haut) et sauter directement à l'étape "tissus" si pertinent.

## Catalogue (`/boutique`)

Grille responsive (2 cols mobile, 3 cols desktop) de product cards :
- Image principale (photo 1), swap vers photo 2 au hover (desktop) — sur mobile, image fixe.
- Nom du modèle + prix "à partir de XX€".
- Click → `/produit/{slug}`.

Modèles initiaux (extraits depuis les uploads) :
1. **Bas échancré** — photos: bas_échancré_1, _2, _3
2. **Tanga** — photos: Tanga_1, _2, _3

Les autres formes existantes dans le configurateur (brésilien, culotte, etc.) sont ajoutées comme entrées de catalogue avec photos placeholder (réutilisant les dessins SVG actuels), en attendant que tu fournisses les photos.

Données stockées dans `src/data/products.ts` (statique, pas de DB) :
```ts
export const products = [
  { slug: "bas-echancre", name: "Bas échancré", priceFrom: 75,
    images: ["/uploads/bas_echancre_1.jpg", "/uploads/bas_echancre_2.png", "/uploads/bas_echancre_3.png"],
    bottomShape: "echancre", topShape: "triangle",
    description: "..." },
  { slug: "tanga", ... },
];
```

Les images uploadées sont externalisées via `lovable-assets` et référencées par leur URL CDN.

## Page produit (`/produit/$slug`)

Layout deux colonnes desktop / empilé mobile :
- Gauche : galerie (image principale + miniatures cliquables)
- Droite : nom, prix "à partir de", description courte, bouton **Personnaliser →** qui mène à `/personnaliser/{slug}`.

## Configurateur (`/personnaliser/$slug`)

Reprend intégralement le code actuel de `src/routes/index.tsx` (étapes tissus → preview → panier → checkout). Le `slug` :
- Pré-remplit forme du bas + forme du haut depuis `products.ts`.
- L'étape 1 "forme" est sautée (on commence directement à l'étape tissus).
- Le compteur d'étapes passe de 1/3-2/3-3/3 à 1/2-2/2.

Panier (state local + Stripe checkout) **inchangé**. `create-checkout`, `stripe-webhook`, `verify-payment` non touchés.

## Homepage (`/`)

- Garde le hero + éditorial existants.
- Retire le bloc configurateur intégré.
- CTA principal devient "Découvrir la boutique" → `/boutique`.

## Assets

Les 6 images uploadées (bas_échancré 1/2/3, Tanga 1/2/3) sont uploadées via `lovable-assets create` depuis `/mnt/user-uploads/`, pointers stockés dans `src/assets/products/*.asset.json`.

## Mobile

- Header : menu hamburger (Sheet shadcn) sur < md.
- Catalogue : 2 colonnes mobile.
- Hover swap désactivé sur touch (media query `hover: hover`).
- Page produit : galerie en haut, infos en bas.

## Hors scope (préservé tel quel)

- Stripe checkout, edge functions, panier state, page À propos, design tokens, fonts.

## Détails techniques

- Routes typées TanStack avec `head()` SEO par page (`og:title`, `og:description` distincts).
- Navigation via `<Link>` typés.
- Pas de DB : catalogue en statique dans `src/data/products.ts`.
- Suppression contrôlée du configurateur de `/` (on déplace, on ne duplique pas).

## Livraison

Preview uniquement. Aucune publication. À ta validation : catalogue, navigation, page produit, flow personnalisation, mobile.
