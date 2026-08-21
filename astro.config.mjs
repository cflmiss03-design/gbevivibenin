import "./src/env.ts"; 
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";

export default defineConfig({
  // Domaine réel confirmé (voir aussi backend-votes/src/config/tenants.js et
  // voteserver.js pour le CORS).
  site: "https://missgbevivibenin.site",

  // Port de dev distinct pour tourner en même temps que les autres sites
  // locaux (missculture: 4321, campusvoice: 4322, hwendo: 4323).
  server: { port: 4324 },

  // Préfixe pour les variables d'environnement (doit être imbriqué sous
  // `vite:` — un `envPrefix` au niveau racine n'est pas une clé Astro
  // reconnue et est silencieusement ignoré, ce qui fait retomber Astro sur
  // son propre défaut (PUBLIC_ uniquement) et empêche VITE_API_BASE_URL
  // d'être exposé côté client. Bug trouvé + corrigé le 2026-08-21.
  vite: {
    envPrefix: ["VITE_", "PUBLIC_"],
  },

  // Intégrations Astro
  integrations: [
    tailwind(),
    sitemap(),
    react(), // composants React hydratés côté client
  ],

  // i18n
  defaultLocale: "fr",
  locales: ["fr", "en"],
  i18nextOptions: {
    interpolation: {
      escapeValue: false,
    },
    fallbackLng: "fr",
  },
});
