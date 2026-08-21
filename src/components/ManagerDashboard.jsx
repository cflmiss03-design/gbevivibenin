import { useEffect, useState } from "react";
import ManagerClient from "./ManagerClient.jsx";
import ManagerDepot from "./ManagerDepot.jsx";
import TicketTypesManager from "./TicketTypesManager.jsx";
import TicketSalesManager from "./TicketSalesManager.jsx";
import TicketClaimsManager from "./TicketClaimsManager.jsx";

// Un seul mot de passe (MANAGER_SECRET côté serveur) protège tout le dashboard.
const SESSION_KEY = "managerDashboardSecret";

const SECTIONS = [
  {
    key: "candidates",
    label: "Candidates",
    icon: "🗳️",
    description: "Tableau de bord des candidates et des votes",
    Component: ManagerClient,
  },
  {
    key: "withdrawals",
    label: "Retraits",
    icon: "💸",
    description: "Gestion des demandes de retraits et des transactions",
    Component: ManagerDepot,
  },
  {
    key: "ticket-types",
    label: "Types de Tickets",
    icon: "🎫",
    description: "Modèles de tickets (prix, SVG, zones QR/nom/numéro)",
    Component: TicketTypesManager,
  },
  {
    key: "ticket-sales",
    label: "Ventes de Tickets",
    icon: "💰",
    description: "Clients, tickets vendus, prix, et classement des candidates par attribution",
    Component: TicketSalesManager,
  },
  {
    key: "ticket-claims",
    label: "Réclamations",
    icon: "📨",
    description: "Tickets non reçus : recherche, envoi par WhatsApp, email de notification",
    Component: TicketClaimsManager,
  },
];
const DEFAULT_SECTION = SECTIONS[0].key;

function getSectionFromUrl() {
  if (typeof window === "undefined") return DEFAULT_SECTION;
  const params = new URLSearchParams(window.location.search);
  const value = params.get("section");
  return SECTIONS.some((s) => s.key === value) ? value : DEFAULT_SECTION;
}

function SidebarContent({ active, onNavigate, onLogout }) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-slate-100">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary-600">
          Miss Gbévivi Bénin
        </p>
        <h2 className="text-lg font-bold text-slate-900">Espace Manager</h2>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => onNavigate(s.key)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors text-left ${
              active === s.key
                ? "bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span>{s.icon}</span>
            {s.label}
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-100">
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-100 transition-colors"
        >
          🚪 Déconnexion
        </button>
      </div>
    </div>
  );
}

export default function ManagerDashboard() {
  const [secret, setSecret] = useState(() =>
    typeof window !== "undefined" ? sessionStorage.getItem(SESSION_KEY) || "" : ""
  );
  const [secretInput, setSecretInput] = useState("");
  const [authError, setAuthError] = useState(null);
  const [activeSection, setActiveSection] = useState(getSectionFromUrl);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    function onPopState() {
      setActiveSection(getSectionFromUrl());
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function goToSection(key) {
    setActiveSection(key);
    setSidebarOpen(false);
    window.history.pushState(null, "", `${window.location.pathname}?section=${key}`);
  }

  function handleUnlock(e) {
    e.preventDefault();
    sessionStorage.setItem(SESSION_KEY, secretInput);
    setAuthError(null);
    setSecret(secretInput);
  }

  function handleUnauthorized() {
    sessionStorage.removeItem(SESSION_KEY);
    setSecret("");
    setAuthError("Mot de passe incorrect.");
  }

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY);
    setSecret("");
  }

  if (!secret) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <form
          onSubmit={handleUnlock}
          className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-slate-200 p-8 space-y-5"
        >
          <div className="text-center space-y-1">
            <p className="text-3xl">🔐</p>
            <h1 className="text-xl font-bold text-slate-900">Espace Manager</h1>
            <p className="text-sm text-slate-500">
              Entrez le mot de passe pour accéder au tableau de bord.
            </p>
          </div>
          <input
            type="password"
            value={secretInput}
            onChange={(e) => setSecretInput(e.target.value)}
            placeholder="Mot de passe manager"
            autoFocus
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none"
            required
          />
          {authError && <p className="text-red-600 text-sm">{authError}</p>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-600 text-white font-bold py-2.5 rounded-lg hover:shadow-lg transition-all"
          >
            Déverrouiller
          </button>
        </form>
      </div>
    );
  }

  const active = SECTIONS.find((s) => s.key === activeSection) || SECTIONS[0];
  const ActiveComponent = active.Component;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 bg-white border-r border-slate-200 sticky top-0 h-screen">
        <SidebarContent active={activeSection} onNavigate={goToSection} onLogout={handleLogout} />
      </aside>

      {/* Sidebar mobile (overlay) */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-64 bg-white h-full shadow-xl animate-slide-right">
            <SidebarContent active={activeSection} onNavigate={goToSection} onLogout={handleLogout} />
          </aside>
        </div>
      )}

      {/* Contenu */}
      <div className="flex-1 min-w-0">
        {/* Barre mobile */}
        <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <button type="button" onClick={() => setSidebarOpen(true)} className="text-slate-700 text-xl">
            ☰
          </button>
          <span className="font-bold text-slate-900 text-sm">
            {active.icon} {active.label}
          </span>
          <div className="w-6" />
        </div>

        <main className="p-4 sm:p-8">
          <div className="mb-6 sm:mb-8 hidden lg:block">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-600">
              Administration
            </p>
            <h1 className="text-3xl font-heading font-bold text-slate-900 mt-1">
              {active.icon} {active.label}
            </h1>
            <p className="text-slate-600 mt-1">{active.description}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-8">
            <ActiveComponent secret={secret} onUnauthorized={handleUnauthorized} />
          </div>
        </main>
      </div>
    </div>
  );
}
