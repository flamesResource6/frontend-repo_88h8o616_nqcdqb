import React, { useEffect, useMemo, useState } from 'react';
import BalanceCard from './BalanceCard';
import AddEntryModal from './AddEntryModal';
import RecordList from './RecordList';
import { db } from '../lib/firebase';
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';

export default function Dashboard({ user }) {
  const [income, setIncome] = useState([]);
  const [expense, setExpense] = useState([]);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    if (!db || !user?.uid) return;

    const incomeCol = collection(db, 'Users', user.uid, 'income');
    const expenseCol = collection(db, 'Users', user.uid, 'expense');

    const unsubIncome = onSnapshot(query(incomeCol, orderBy('date', 'desc')), (snap) => {
      setIncome(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    const unsubExpense = onSnapshot(query(expenseCol, orderBy('date', 'desc')), (snap) => {
      setExpense(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubIncome();
      unsubExpense();
    };
  }, [user?.uid]);

  const totals = useMemo(() => {
    const totalIncome = income.reduce((s, i) => s + Number(i.amount || 0), 0);
    const totalExpense = expense.reduce((s, i) => s + Number(i.amount || 0), 0);
    return { totalIncome, totalExpense };
  }, [income, expense]);

  const addIncome = async (entry) => {
    if (!db || !user?.uid) return;
    const incomeCol = collection(db, 'Users', user.uid, 'income');
    await addDoc(incomeCol, entry);
  };
  const addExpense = async (entry) => {
    if (!db || !user?.uid) return;
    const expenseCol = collection(db, 'Users', user.uid, 'expense');
    await addDoc(expenseCol, entry);
  };

  return (
    <div className="space-y-6">
      <BalanceCard totalIncome={totals.totalIncome} totalExpense={totals.totalExpense} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => setModal('income')}
          className="w-full rounded-2xl px-4 py-4 font-semibold text-[#111111]"
          style={{ backgroundColor: '#00FFAA' }}
        >
          Add Income
        </button>
        <button
          onClick={() => setModal('expense')}
          className="w-full rounded-2xl px-4 py-4 font-semibold text-[#111111]"
          style={{ backgroundColor: '#FF5555' }}
        >
          Add Expense
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecordList title="Recent Income" items={income} accent="#00FFAA" />
        <RecordList title="Recent Expenses" items={expense} accent="#FF5555" />
      </div>

      <AddEntryModal
        open={modal === 'income'}
        type="income"
        onClose={() => setModal(null)}
        onSave={addIncome}
      />
      <AddEntryModal
        open={modal === 'expense'}
        type="expense"
        onClose={() => setModal(null)}
        onSave={addExpense}
      />
    </div>
  );
}
