// app/pricing/components/PaymentToggle.tsx (W pełni poprawiony)

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
        
        {/* Tło przełącznika */}
        <div 
          className={`absolute top-1 bottom-1 w-1/2 bg-blue-600 rounded-full shadow-md transition-all duration-300 ease-in-out`}
          style={{ transform: isMonthly ? 'translateX(0%)' : 'translateX(100%)' }}
        />

        {/* Opcja Miesięczna */}
        <button
          type="button"
          // Warunkowe style dla kursora (Punkt 1)
          className={`z-10 px-6 py-2 text-sm font-medium rounded-full transition-colors duration-300 
            ${isMonthly ? 'text-white cursor-default' : 'text-gray-700 hover:text-gray-900 cursor-pointer'}`}
          onClick={() => onToggle('monthly')}
          disabled={isMonthly} // BLOKUJEMY KLIKANIE, GDY JEST AKTYWNY (Punkt 1)
        >
          Miesięcznie
        </button>

        {/* Opcja Roczna */}
        <button
          type="button"
          // Warunkowe style dla kursora (Punkt 1)
          className={`z-10 px-6 py-2 text-sm font-medium rounded-full transition-colors duration-300 
            ${isMonthly ? 'text-gray-700 hover:text-gray-900 cursor-pointer' : 'text-white cursor-default'}`}
          onClick={() => onToggle('yearly')}
          disabled={!isMonthly} // BLOKUJEMY KLIKANIE, GDY JEST AKTYWNY (Punkt 1)
        >
          Rocznie
        </button>
      </div>
    </div>
  );
};

export default PaymentToggle;