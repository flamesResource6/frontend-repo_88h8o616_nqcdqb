import React, { useMemo } from 'react';

export default function BalanceCard({ income = [], expense = [] }) {
  const totalIncome = useMemo(() => income.reduce((sum, i) => sum + (Number(i.amount) || 0), 0), [income]);
  const totalExpense = useMemo(() => expense.reduce((sum, i) => sum + (Number(i.amount) || 0), 0), [expense]);
  const balance = totalIncome - totalExpense;

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-white/60 text-sm">Balance</div>
          <div className="text-3xl sm:text-4xl font-bold">${balance.toLocaleString()}</div>
        </div>
        <div className="text-right">
          <div className="text-white/60 text-sm">Income</div>
          <div className="text-xl font-semibold" style={{ color: '#00FFAA' }}>
            +${totalIncome.toLocaleString()}
          </div>
          <div className="text-white/60 text-sm mt-2">Expense</div>
          <div className="text-xl font-semibold" style={{ color: '#FF5555' }}>
            -${totalExpense.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
