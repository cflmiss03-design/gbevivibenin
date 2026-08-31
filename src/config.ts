/**
 * Configuration statique compilée lors du build
 * Ces valeurs sont intégrées directement dans le code et apparaîtront dans /dist
 */

// Lors du build, Astro remplace import.meta.env par les valeurs réelles.
//
// Origine du backend (sans préfixe /api/<tenant>) — un seul backend partagé
// par les 2 concours de ce frontend (Miss Gbévivi Bénin + Théâtre Culturel,
// voir backend-votes/src/config/tenants.js). Repli : même origine de
// production que VITE_API_BASE_URL utilisait avant (compat si la variable
// Cloudflare n'a pas encore été renommée en VITE_API_ORIGIN).
const API_ORIGIN = (import.meta.env.VITE_API_ORIGIN || 'https://server-miss-culture-benin-production.up.railway.app').replace(/\/$/, '');
const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'wss://server-miss-culture-benin-production.up.railway.app';

// Théâtre Culturel : concours indépendant (candidats, période de vote,
// tarif et classement propres — jamais mélangé à Miss Gbévivi) qui partage
// ce même frontend, sous /theatre-culturel. Plutôt que de threader un
// "apiPrefix" à travers chaque composant qui appelle fetchAPI (CandidateGrid,
// VoteModal, VoteCounter, Progress...), on résout le bon préfixe UNE FOIS
// ici, à partir du premier segment de l'URL courante. Ça marche parce que
// chaque page est statique (pas un SPA) : à chaque chargement de page, ce
// module se réinitialise avec le bon pathname. Au build (SSG, pas de
// `window`) : aucun de ces composants n'appelle l'API pendant le build,
// donc la valeur par défaut ne sert jamais réellement — juste là pour que
// le code compile. Toute URL qui n'est PAS sous /theatre-culturel (accueil,
// candidates Miss Gbévivi à la racine, galerie...) retombe sur /api/gbevivi.
function resolveApiPrefix() {
  if (typeof window === 'undefined') return '/api/gbevivi';
  const firstSegment = window.location.pathname.split('/').filter(Boolean)[0];
  return firstSegment === 'theatre-culturel' ? '/api/gbevivi-theatre' : '/api/gbevivi';
}

const API_BASE_URL = `${API_ORIGIN}${resolveApiPrefix()}`;

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
