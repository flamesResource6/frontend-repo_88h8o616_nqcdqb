import React, { useState, useEffect } from 'react';

export default function AddEntryModal({
  open,
  type = 'income',
  onClose,
  onSave,
}) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (open) {
      setAmount('');
      setNote('');
    }
  }, [open, type]);

  if (!open) return null;

  const accent = type === 'income' ? '#00FFAA' : '#FF5555';

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) return;
    onSave({ amount: parsed, note: note.trim(), date: new Date().toISOString() });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60">
      <div className="w-full sm:max-w-md bg-[#111111] border border-white/10 rounded-t-2xl sm:rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold text-lg capitalize">Add {type}</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white text-sm">Close</button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="text-white/80 text-sm">Amount</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2"
              placeholder="0.00"
              style={{ outlineColor: accent }}
              required
            />
          </div>

          <div>
            <label className="text-white/80 text-sm">Note</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-1 w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2"
              placeholder="Description"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full font-medium rounded-lg px-4 py-2"
            style={{ backgroundColor: accent, color: '#111111' }}
          >
            Save {type}
          </button>
        </form>
      </div>
    </div>
  );
}
