/**
 * Configuration statique compilée lors du build
 * Ces valeurs sont intégrées directement dans le code et apparaîtront dans /dist
 */

// Lors du build, Astro remplace import.meta.env par les valeurs réelles.
// Le repli (si VITE_API_BASE_URL n'est pas encore défini côté hébergeur,
// ex. variables pas encore posées dans le dashboard Cloudflare Pages) doit
// pointer vers le compartiment gbevivi et non vers /api nu (qui est celui
// de Miss Culture Bénin) — sinon le site sert silencieusement les mauvaises
// données tant que la variable n'est pas configurée. Bug constaté le
// 2026-08-21 : premier déploiement Cloudflare sans les variables posées.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://server-miss-culture-benin-production.up.railway.app/api/gbevivi';
const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'wss://server-miss-culture-benin-production.up.railway.app';

//const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
//const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:5000/';

// Dates uniquement indicatives pour les données structurées SEO (JSON-LD
// Event). Purement statiques, à mettre à jour manuellement dans le code si
// besoin — n'ont plus aucun effet sur le blocage réel du bouton "Voter",
// qui est désormais piloté depuis le manager (voir services/votingPeriod.js).
export const SEO_VOTING_START_DATE = "2026-08-06";
export const SEO_VOTING_END_DATE = "2026-08-10";

// Calcule l'état des votes à partir de la période renvoyée par l'API (voir
// services/votingPeriod.js — GET /settings/voting-period). votingStartAt et
// votingEndAt sont des instants ISO UTC exacts (saisis en heure du Bénin
// côté manager) : la bascule se fait donc au même instant pour tous les
// visiteurs, quel que soit leur propre fuseau horaire.
//
// Le bouton spécial (voteOverrideMode) est prioritaire sur les dates :
// "force_open" garde les votes ouverts quoi que disent les dates,
// "force_closed" les bloque immédiatement — dans les deux cas accompagné
// d'un court message (voteOverrideMessage) à afficher à la place de l'état
// normal (barre de progression, messages de blocage).
export function getVotingState(period) {
  if (!period) {
    // Pas encore chargé => on bloque par prudence.
    return { closed: true, notStarted: false, overrideActive: false, overrideMessage: null };
  }
  if (period.voteOverrideMode === "force_open") {
    return { closed: false, notStarted: false, overrideActive: true, overrideMessage: period.voteOverrideMessage || null };
  }
  if (period.voteOverrideMode === "force_closed") {
    return { closed: true, notStarted: false, overrideActive: true, overrideMessage: period.voteOverrideMessage || null };
  }
  if (!period.votingStartAt || !period.votingEndAt) {
    return { closed: true, notStarted: false, overrideActive: false, overrideMessage: null };
  }
  const now = Date.now();
  const start = new Date(period.votingStartAt).getTime();
  const end = new Date(period.votingEndAt).getTime();
  return {
    closed: now < start || now > end,
    notStarted: now < start,
    overrideActive: false,
    overrideMessage: null,
  };
}

// Exporte les constantes
export const config = {
  apiBaseUrl: API_BASE_URL,
  wsBaseUrl: WS_BASE_URL,
};

export default config;
