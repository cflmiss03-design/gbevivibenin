# Miss Gbévivi Bénin — Site public

Site Astro statique (une seule catégorie de concours). Build entièrement
statique, aucun serveur requis pour l'hébergement.

## Déploiement sur Cloudflare Pages / Workers

1. Connecter ce dépôt GitHub à un nouveau projet Cloudflare Pages (ou Worker avec assets statiques).
2. Paramètres de build :
   - **Build command** : `npm run build`
   - **Build output directory** : `dist`
   - **Root directory** : `/` (racine du dépôt — ce dépôt ne contient que ce site, pas de monorepo)
3. Variables d'environnement à définir dans Cloudflare Pages (Settings → Environment variables) :
   - `VITE_API_BASE_URL` = `https://server-miss-culture-benin-production.up.railway.app/api/gbevivi`
   - `VITE_WS_BASE_URL` = `wss://server-miss-culture-benin-production.up.railway.app`
   - (voir `.env` en local pour les valeurs actuelles — ne pas committer `.env`, il est dans `.gitignore`)
4. Node.js : la version est épinglée via `.node-version` (22) et `engines.node` dans `package.json` (>=18.20.8) — Cloudflare Pages les respecte automatiquement, rien à configurer en plus.

Le build a été vérifié en isolation totale (sans accès au monorepo local ni
à un `node_modules` préexistant) avant le premier push, avec le
`package-lock.json` committé pour garantir un résultat reproductible.

## Domaine

Le domaine officiel `missgbevivibenin.site` est déjà utilisé dans
`astro.config.mjs` (`site:`) et les métadonnées SEO. Le backend
(`backend-votes`) autorise déjà ce domaine en CORS. Il suffit de le brancher
comme domaine personnalisé sur le projet Cloudflare Pages une fois le projet
créé.

## Développement local

```bash
npm install
npm run dev     # http://localhost:4324
npm run build   # génère dist/
```
