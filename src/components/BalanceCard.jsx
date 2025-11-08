import React from 'react';

export default function BalanceCard({ totalIncome = 0, totalExpense = 0 }) {
  const balance = totalIncome - totalExpense;
  return (
    <div className="w-full bg-[#111111] border border-white/10 rounded-2xl p-6 sm:p-8">
      <div>
        <div className="text-white/80 text-sm">Remaining Balance</div>
        <div className="text-white text-4xl sm:text-5xl font-extrabold tracking-tight mt-1">
          ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-xl p-4">
          <div className="text-xs text-white/60">Total Income</div>
          <div className="mt-1 text-xl font-semibold" style={{ color: '#00FFAA' }}>
            ${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-4">
          <div className="text-xs text-white/60">Total Expense</div>
          <div className="mt-1 text-xl font-semibold" style={{ color: '#FF5555' }}>
            ${totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>
    </div>
  );
}
