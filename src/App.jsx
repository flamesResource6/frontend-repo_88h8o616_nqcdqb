import React, { useMemo, useState } from 'react';
import Hero3D from './components/Hero3D';
import BalanceCard from './components/BalanceCard';
import AddEntryModal from './components/AddEntryModal';
import RecordList from './components/RecordList';

function useLocalEntries() {
  const [income, setIncome] = useState([]);
  const [expense, setExpense] = useState([]);

  const totals = useMemo(() => {
    const totalIncome = income.reduce((s, i) => s + Number(i.amount || 0), 0);
    const totalExpense = expense.reduce((s, i) => s + Number(i.amount || 0), 0);
    return { totalIncome, totalExpense };
  }, [income, expense]);

  const addIncome = (entry) => setIncome((prev) => [{ ...entry }, ...prev]);
  const addExpense = (entry) => setExpense((prev) => [{ ...entry }, ...prev]);

  return { income, expense, totals, addIncome, addExpense };
}

export default function App() {
  const { income, expense, totals, addIncome, addExpense } = useLocalEntries();
  const [modal, setModal] = useState(null); // 'income' | 'expense' | null

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
        <Hero3D />

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
