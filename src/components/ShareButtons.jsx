import React from "react";

// Important : l'URL n'est PAS reconstruite depuis candidate.slug (ça oubliait
// le préfixe /theatre-culturel/ pour les groupes du concours Théâtre
// Culturel, et pointait vers une URL fausse) ni calculée au rendu (sur une
// page statique, ce composant est pré-rendu au build où window n'existe pas
// — un lien figé au rendu resterait vide tant que React n'a pas fini
// d'hydrater la page, cf. le même bug déjà rencontré et corrigé sur
// frontend-votes-hwendo). On lit window.location.href AU MOMENT DU CLIC :
// toujours la bonne URL, quelle que soit la page ou l'état d'hydratation.
export default function ShareButtons({ candidate, shareMessage }) {
  // shareMessage : chaîne déjà composée (pas une fonction — non
  // sérialisable à travers la frontière Astro → île React client:load).
  // Sans valeur fournie, le message par défaut (Miss Gbévivi) s'applique.
  const message =
    shareMessage ||
    `Salut !

Je suis ${candidate.firstName} ${candidate.secondName || ""} ${candidate.lastName}, candidate officielle au prestigieux concours Miss Gbévivi Bénin 2026.
Je serai honorée de pouvoir compter sur votre précieux soutien tout au long de cette aventure.
N'hésitez pas à partager mon profil et à voter pour moi.

Je vous remercie sincèrement pour votre accompagnement.`;

  function currentUrl() {
    return typeof window !== "undefined" ? window.location.href : "";
  }

  function shareOnWhatsApp() {
    const text = encodeURIComponent(`${message} ${currentUrl()}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank", "noopener,noreferrer");
  }

  function shareOnFacebook() {
    const url = encodeURIComponent(currentUrl());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="mt-2 flex justify-center sm:justify-start gap-4">
      <button
        type="button"
        onClick={shareOnWhatsApp}
        className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
        aria-label="Partager sur WhatsApp"
      >
        WhatsApp
      </button>

      <button
        type="button"
        onClick={shareOnFacebook}
        className="bg-blue-700 text-white px-4 py-2 rounded-xl hover:bg-blue-800 transition"
        aria-label="Partager sur Facebook"
      >
        Facebook
      </button>
    </div>
  );
}
