import React, { useState } from 'react';

const TransactionFilters = ({ filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      type: '',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
      sortBy: 'date',
      sortOrder: 'desc',
      page: 1
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Filters & Sorting</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            value={localFilters.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            value={localFilters.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            value={localFilters.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Sort By</label>
          <select
            value={localFilters.sortBy}
            onChange={(e) => handleChange('sortBy', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
            <option value="type">Type</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Min Amount</label>
          <input
            type="number"
            value={localFilters.minAmount}
            onChange={(e) => handleChange('minAmount', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="0.00"
            step="0.01"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Max Amount</label>
          <input
            type="number"
            value={localFilters.maxAmount}
            onChange={(e) => handleChange('maxAmount', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="0.00"
            step="0.01"
            min="0"
          />
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={applyFilters}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Apply Filters
        </button>
        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default TransactionFilters;