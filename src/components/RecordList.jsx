import React from 'react';

export default function RecordList({ items = [], title = 'Recent', accent = '#00FFAA' }) {
  return (
    <div className="bg-[#111111] border border-white/10 rounded-2xl p-4 sm:p-6">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-white font-semibold">{title}</h4>
        <span className="text-xs text-white/50">{items.length} items</span>
      </div>
      <ul className="space-y-3">
        {items.length === 0 && (
          <li className="text-white/50 text-sm">No records yet.</li>
        )}
        {items.map((it, idx) => (
          <li key={idx} className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2">
            <div>
              <div className="text-white text-sm">{it.note || '—'}</div>
              <div className="text-white/50 text-xs">{new Date(it.date).toLocaleString()}</div>
            </div>
            <div className="font-semibold" style={{ color: accent }}>
              ${Number(it.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
