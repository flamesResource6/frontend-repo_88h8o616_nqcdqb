import React, { useEffect, useState } from 'react';

export default function AddEntryModal({ open, type = 'income', onClose, onSubmit }) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (open) {
      setAmount('');
      setNote('');
    }
  }, [open]);

  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    const value = parseFloat(amount);
    if (Number.isNaN(value) || value <= 0) return alert('Enter a valid amount');
    onSubmit?.({ amount: value, note, createdAt: new Date().toISOString(), type });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md mx-auto rounded-2xl bg-zinc-900 border border-white/10 p-6 text-white">
        <div className="text-lg font-semibold mb-4">Add {type === 'income' ? 'Income' : 'Expense'}</div>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-sm text-white/70 mb-1">Amount</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-white/5 text-white rounded-lg px-3 py-2 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">Note</label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-white/5 text-white rounded-lg px-3 py-2 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 border border-white/10">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-md bg-white text-black font-semibold">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
