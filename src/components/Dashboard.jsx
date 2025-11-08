import React, { useEffect, useMemo, useState } from 'react';
import { auth } from '../firebase';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import BalanceCard from './BalanceCard';
import AddEntryModal from './AddEntryModal';
import RecordList from './RecordList';

export default function Dashboard() {
  const [income, setIncome] = useState([]);
  const [expense, setExpense] = useState([]);
  const [open, setOpen] = useState(null); // 'income' | 'expense' | null

  useEffect(() => {
    const u = auth.currentUser;
    if (!u) return;
    const qi = query(collection(db, `Users/${u.uid}/income`), orderBy('createdAt', 'desc'));
    const qe = query(collection(db, `Users/${u.uid}/expense`), orderBy('createdAt', 'desc'));

    const unsubIncome = onSnapshot(qi, (snap) => {
      setIncome(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      );
    });
    const unsubExpense = onSnapshot(qe, (snap) => {
      setExpense(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      );
    });

    return () => { unsubIncome(); unsubExpense(); };
  }, []);

  const addEntry = async ({ amount, note, type }) => {
    const u = auth.currentUser;
    if (!u) return alert('Please sign in');
    await addDoc(collection(db, `Users/${u.uid}/${type}`), {
      amount: Number(amount),
      note,
      createdAt: serverTimestamp(),
    });
    setOpen(null);
  };

  return (
    <div className="space-y-4">
      <BalanceCard income={income} expense={expense} />

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-white/80">Income</div>
            <button
              onClick={() => setOpen('income')}
              className="px-3 py-1.5 rounded-md bg-white text-black text-sm font-semibold"
              style={{ backgroundColor: '#00FFAA', color: '#111111' }}
            >
              Add
            </button>
          </div>
          <RecordList title="Income" color="#00FFAA" items={income} />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-white/80">Expense</div>
            <button
              onClick={() => setOpen('expense')}
              className="px-3 py-1.5 rounded-md text-sm font-semibold"
              style={{ backgroundColor: '#FF5555', color: '#111111', borderRadius: '0.5rem' }}
            >
              Add
            </button>
          </div>
          <RecordList title="Expense" color="#FF5555" items={expense} />
        </div>
      </div>

      <AddEntryModal
        open={!!open}
        type={open || 'income'}
        onClose={() => setOpen(null)}
        onSubmit={addEntry}
      />
    </div>
  );
}
