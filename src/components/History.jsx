import React, { useEffect, useMemo, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

function isInRange(dateISO, range) {
  const d = new Date(dateISO);
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (range === 'today') {
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(startOfDay.getDate() + 1);
    return d >= startOfDay && d < endOfDay;
  }

  if (range === 'week') {
    const day = startOfDay.getDay(); // 0 (Sun) - 6 (Sat)
    const diffToMonday = (day + 6) % 7; // make Monday start
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfWeek.getDate() - diffToMonday);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);
    return d >= startOfWeek && d < endOfWeek;
  }

  if (range === 'month') {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return d >= startOfMonth && d < endOfMonth;
  }

  return true;
}

export default function History({ user }) {
  const [income, setIncome] = useState([]);
  const [expense, setExpense] = useState([]);
  const [filter, setFilter] = useState('today'); // today | week | month

  useEffect(() => {
    if (!db || !user?.uid) return;
    const incomeCol = collection(db, 'Users', user.uid, 'income');
    const expenseCol = collection(db, 'Users', user.uid, 'expense');

    const unsubIncome = onSnapshot(query(incomeCol, orderBy('date', 'desc')), (snap) => {
      setIncome(snap.docs.map((d) => ({ id: d.id, type: 'income', ...d.data() })));
    });
    const unsubExpense = onSnapshot(query(expenseCol, orderBy('date', 'desc')), (snap) => {
      setExpense(snap.docs.map((d) => ({ id: d.id, type: 'expense', ...d.data() })));
    });

    return () => {
      unsubIncome();
      unsubExpense();
    };
  }, [user?.uid]);

  const combined = useMemo(() => {
    const all = [...income, ...expense].filter((it) => it?.date && isInRange(it.date, filter));
    return all.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [income, expense, filter]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button
          className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
            filter === 'today' ? 'bg-white text-[#111111] border-white/10' : 'bg-white/5 text-white/80 border-white/10'
          }`}
          onClick={() => setFilter('today')}
        >
          Today
        </button>
        <button
          className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
            filter === 'week' ? 'bg-white text-[#111111] border-white/10' : 'bg-white/5 text-white/80 border-white/10'
          }`}
          onClick={() => setFilter('week')}
        >
          This Week
        </button>
        <button
          className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
            filter === 'month' ? 'bg-white text-[#111111] border-white/10' : 'bg-white/5 text-white/80 border-white/10'
          }`}
          onClick={() => setFilter('month')}
        >
          This Month
        </button>
      </div>

      <div className="bg-[#111111] border border-white/10 rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-white font-semibold">History</h4>
          <span className="text-xs text-white/50">{combined.length} items</span>
        </div>
        <ul className="space-y-3">
          {combined.length === 0 && (
            <li className="text-white/50 text-sm">No transactions for this range.</li>
          )}
          {combined.map((it) => {
            const accent = it.type === 'income' ? '#00FFAA' : '#FF5555';
            return (
              <li key={`${it.type}-${it.id}`} className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2">
                <div>
                  <div className="text-white text-sm">{it.note || '—'}</div>
                  <div className="text-white/50 text-xs">{new Date(it.date).toLocaleString()}</div>
                </div>
                <div className="font-semibold" style={{ color: accent }}>
                  {it.type === 'expense' ? '-' : '+'}${Number(it.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
