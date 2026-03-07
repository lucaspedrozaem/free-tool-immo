"use client";

import { Icon } from "@iconify/react";

const cards = [
  {
    title: "Analytics",
    desc: "Site traffic & tool usage",
    icon: "ph:chart-line-up",
    color: "from-sky-500/10 to-sky-500/5",
  },
  {
    title: "Tools",
    desc: "Manage tools & visibility",
    icon: "ph:wrench",
    color: "from-violet-500/10 to-violet-500/5",
  },
  {
    title: "Content",
    desc: "Guides, SEO & metadata",
    icon: "ph:article",
    color: "from-amber-500/10 to-amber-500/5",
  },
  {
    title: "Settings",
    desc: "Branding, domain & config",
    icon: "ph:gear-six",
    color: "from-emerald-500/10 to-emerald-500/5",
  },
];

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Top bar */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon icon="ph:shield-check-fill" className="text-sky-400 text-2xl" />
          <span className="font-semibold text-lg tracking-tight">
            MLS Photo Tools <span className="text-sky-400">Admin</span>
          </span>
        </div>
        <a
          href="/"
          className="text-sm text-gray-400 hover:text-white transition flex items-center gap-1"
        >
          <Icon icon="ph:arrow-left" />
          Back to site
        </a>
      </header>

      {/* Dashboard */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400 mb-8">
          Welcome back. Choose a section to manage.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cards.map((card) => (
            <button
              key={card.title}
              className={`rounded-xl bg-gradient-to-br ${card.color} border border-white/5 p-6 text-left hover:border-white/15 transition group`}
            >
              <Icon
                icon={card.icon}
                className="text-3xl mb-3 text-gray-300 group-hover:text-white transition"
              />
              <h2 className="font-semibold text-lg">{card.title}</h2>
              <p className="text-sm text-gray-400">{card.desc}</p>
            </button>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-white/10 bg-white/5 p-8 text-center text-gray-500">
          <Icon icon="ph:rocket-launch" className="text-4xl mx-auto mb-3 text-gray-600" />
          <p className="font-medium text-gray-400">Sections coming soon</p>
          <p className="text-sm mt-1">
            This admin panel is ready to be extended with analytics, content
            management, and settings.
          </p>
        </div>
      </main>
    </div>
  );
}
