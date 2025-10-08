// app/pricing/components/PaymentToggle.tsx (Dodany Gradient)

import React from 'react';

interface PaymentToggleProps {
  currentPeriod: 'monthly' | 'yearly';
  onToggle: (period: 'monthly' | 'yearly') => void;
}

const PaymentToggle: React.FC<PaymentToggleProps> = ({ currentPeriod, onToggle }) => {
  
  const isMonthly = currentPeriod === 'monthly';

  return (
    <div className="flex justify-center mb-10">
      <div 
        className="relative flex p-1 bg-gray-100 rounded-full shadow-inner" 
      >
        
        {/* Tło przełącznika: Gradient (Punkt 3) */}
        <div 
          // Zmieniamy bg-blue-600 na subtelny gradient od niebieskiego do ciemniejszego niebieskiego
          className={`absolute top-1 bottom-1 w-1/2 bg-gradient-to-b from-blue-600 to-blue-700 rounded-full shadow-md transition-all duration-300 ease-in-out`}
          style={{ transform: isMonthly ? 'translateX(0%)' : 'translateX(100%)' }}
        />

        {/* Opcja Miesięczna */}
        <button
          type="button"
          className={`z-10 px-6 py-2 text-sm font-medium rounded-full transition-colors duration-300 
            ${isMonthly ? 'text-white cursor-default' : 'text-gray-700 hover:text-gray-900 cursor-pointer'}`}
          onClick={() => onToggle('monthly')}
          disabled={isMonthly}
        >
          Miesięcznie
        </button>

        {/* Opcja Roczna */}
        <button
          type="button"
          className={`z-10 px-6 py-2 text-sm font-medium rounded-full transition-colors duration-300 
            ${isMonthly ? 'text-gray-700 hover:text-gray-900 cursor-pointer' : 'text-white cursor-default'}`}
          onClick={() => onToggle('yearly')}
          disabled={!isMonthly}
        >
          Rocznie
        </button>
      </div>
    </div>
  );
};

export default PaymentToggle;