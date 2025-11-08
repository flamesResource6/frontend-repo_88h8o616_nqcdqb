import React, { useEffect, useMemo, useState } from 'react';
import { auth, db } from '../firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

const isToday = (d) => {
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
};

const isThisWeek = (d) => {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = (day === 0 ? -6 : 1) - day; // Monday as first day
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return d >= monday && d <= sunday;
};

const isThisMonth = (d) => {
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
};

export default function History() {
  const [income, setIncome] = useState([]);
  const [expense, setExpense] = useState([]);
  const [filter, setFilter] = useState('today'); // today | week | month

  useEffect(() => {
    const u = auth.currentUser;
    if (!u) return;
    const qi = query(collection(db, `Users/${u.uid}/income`), orderBy('createdAt', 'desc'));
    const qe = query(collection(db, `Users/${u.uid}/expense`), orderBy('createdAt', 'desc'));

    const unsubIncome = onSnapshot(qi, (snap) => setIncome(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    const unsubExpense = onSnapshot(qe, (snap) => setExpense(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));

    return () => { unsubIncome(); unsubExpense(); };
  }, []);

  const combined = useMemo(() => {
    const mapDoc = (doc, type) => {
      let date;
      if (doc.createdAt?.toDate) {
        date = doc.createdAt.toDate();
      } else if (doc.createdAt) {
        date = new Date(doc.createdAt);
      } else {
        date = new Date();
      }
      return { ...doc, type, date };
    };
    const items = [
      ...income.map((d) => mapDoc(d, 'income')),
      ...expense.map((d) => mapDoc(d, 'expense')),
    ];
    items.sort((a, b) => b.date - a.date);

    let predicate = isToday;
    if (filter === 'week') predicate = isThisWeek;
    if (filter === 'month') predicate = isThisMonth;

    return items.filter((i) => predicate(i.date));
  }, [income, expense, filter]);

  return (
    <div className="space-y-4 text-white">
      <div className="flex items-center gap-2">
        <button onClick={() => setFilter('today')} className={`px-3 py-1.5 rounded-md border ${filter==='today' ? 'bg-white text-black border-white' : 'bg-white/5 text-white border-white/10'}`}>Today</button>
        <button onClick={() => setFilter('week')} className={`px-3 py-1.5 rounded-md border ${filter==='week' ? 'bg-white text-black border-white' : 'bg-white/5 text-white border-white/10'}`}>This Week</button>
        <button onClick={() => setFilter('month')} className={`px-3 py-1.5 rounded-md border ${filter==='month' ? 'bg-white text-black border-white' : 'bg-white/5 text-white border-white/10'}`}>This Month</button>
      </div>

      <div className="space-y-2">
        {combined.length === 0 && <div className="text-white/50 text-sm">No activity for this period</div>}
        {combined.map((it) => (
          <div key={`${it.type}-${it.id}`} className="flex items-center justify-between bg-black/20 border border-white/10 rounded-lg px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: it.type === 'income' ? '#00FFAA' : '#FF5555', color: '#111111' }}>
                {it.type}
              </span>
              <div className="text-white/80">{it.note || '—'}</div>
            </div>
            <div className="text-right">
              <div className="font-semibold" style={{ color: it.type === 'income' ? '#00FFAA' : '#FF5555' }}>
                {it.type === 'income' ? '+' : '-'}${Number(it.amount).toLocaleString()}
              </div>
              <div className="text-xs text-white/50">{it.date.toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
