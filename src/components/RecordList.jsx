import React from 'react';

export default function RecordList({ title, color = '#00FFAA', items = [] }) {
  return (
    <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 text-white">
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold" style={{ color }}>{title}</div>
        <div className="text-xs text-white/50">{items.length} items</div>
      </div>
      <div className="space-y-2 max-h-64 overflow-auto pr-1">
        {items.length === 0 && (
          <div className="text-white/50 text-sm">No records yet</div>
        )}
        {items.map((it) => (
          <div key={it.id} className="flex items-center justify-between bg-black/20 border border-white/10 rounded-lg px-3 py-2">
            <div className="text-white/80 text-sm">{it.note || '—'}</div>
            <div className="text-white font-medium">${Number(it.amount).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
