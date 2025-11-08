import React from 'react';

export default function TopNav({ tab, setTab }) {
  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'history', label: 'History' },
  ];

  return (
    <div className="w-full flex items-center justify-between py-4 px-3 sm:px-6 bg-black/40 backdrop-blur rounded-xl border border-white/5">
      <div className="text-white/80 font-semibold">SmartBalance</div>
      <div className="flex items-center gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
              tab === t.key
                ? 'bg-white text-black border-white'
                : 'text-white/70 border-white/10 hover:border-white/30 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
