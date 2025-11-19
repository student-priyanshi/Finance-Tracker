import React from 'react';

const SummaryCard = ({ summary }) => {
  const cards = [
    {
      title: 'Total Income',
      amount: summary.income,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      icon: '💰'
    },
    {
      title: 'Total Expense',
      amount: summary.expense,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      icon: '💸'
    },
    {
      title: 'Balance',
      amount: summary.balance,
      color: summary.balance >= 0 ? 'text-blue-600' : 'text-orange-600',
      bgColor: summary.balance >= 0 ? 'bg-blue-50' : 'bg-orange-50',
      icon: summary.balance >= 0 ? '📈' : '📉'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <div key={index} className={`${card.bgColor} rounded-lg p-6 shadow`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">{card.icon}</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
              <p className={`text-2xl font-semibold ${card.color}`}>
                ${card.amount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCard;