import React from 'react';

function StatCard({ icon, label, value, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-blue-900 border-blue-700',
    green: 'bg-green-900 border-green-700',
    red: 'bg-red-900 border-red-700',
    purple: 'bg-purple-900 border-purple-700',
    orange: 'bg-orange-900 border-orange-700'
  };

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-300 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}

export default StatCard;
