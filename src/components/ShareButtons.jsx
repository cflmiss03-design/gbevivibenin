import React from "react";

export default function ShareButtons({ candidate }) {
  const url = encodeURIComponent(`https://missgbevivibenin.site/${candidate.slug}`);
const text = encodeURIComponent(
  `Salut !

Je suis ${candidate.firstName} ${candidate.secondName || ""} ${candidate.lastName}, candidate officielle au prestigieux concours Miss Gbévivi Bénin 2026.
Je serai honorée de pouvoir compter sur votre précieux soutien tout au long de cette aventure.
N’hésitez pas à partager mon profil et à voter pour moi.

Je vous remercie sincèrement pour votre accompagnement.`
);

  return (
    <div className="mt-2 flex justify-center sm:justify-start gap-4">
      {/* WhatsApp */}
      <a
        href={`https://api.whatsapp.com/send?text=${text} ${url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
        aria-label="Partager sur WhatsApp"
      >
        WhatsApp
      </a>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-700 text-white px-4 py-2 rounded-xl hover:bg-blue-800 transition"
        aria-label="Partager sur Facebook"
      >
        Facebook
      </a>
    </div>
  );
}
