"use client";

import { useEffect, useState } from "react";
import { getVotingPeriod } from "../services/votingPeriod.js";

// Affiche la vraie période de vote (celle pilotée depuis le manager, la même
// source que la barre de progression sur la page d'accueil) au lieu d'un
// texte statique "À confirmer" qui pouvait se désynchroniser de la réalité.
export default function VotingPeriodBadge() {
  const [label, setLabel] = useState("À confirmer");

  useEffect(() => {
    getVotingPeriod()
      .then((period) => {
        if (!period) return;

        if (period.voteOverrideMode === "force_open" || period.voteOverrideMode === "force_closed") {
          setLabel(period.voteOverrideMessage || (period.voteOverrideMode === "force_open" ? "Votes ouverts" : "Votes fermés"));
          return;
        }

        if (!period.votingStartAt || !period.votingEndAt) return;

        const start = new Date(period.votingStartAt);
        const end = new Date(period.votingEndAt);
        const fmt = (d) => d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });

        setLabel(`${fmt(start)} → ${fmt(end)}`);
      })
      .catch((err) => console.error("Erreur récupération période de vote :", err));
  }, []);

  return <>{label}</>;
}
