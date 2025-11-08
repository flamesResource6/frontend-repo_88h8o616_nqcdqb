import React from 'react';

export default function TopNav({ value = 'overview', onChange }) {
  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'history', label: 'History' },
  ];

  return (
    <div className="inline-flex bg-white/5 border border-white/10 rounded-xl p-1">
      {tabs.map((t) => {
        const active = value === t.key;
        return (
          <button
            key={t.key}
            onClick={() => onChange && onChange(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              active ? 'bg-white text-[#111111]' : 'text-white/70 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
