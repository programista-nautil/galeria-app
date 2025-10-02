import React from 'react';

// Definicja typów dla tego, co komponent ma przyjmować.
// Przyjmuje aktualny wybór ('monthly' lub 'yearly') i funkcję do zmiany tego wyboru.
interface PaymentToggleProps {
  currentPeriod: 'monthly' | 'yearly';
  onToggle: (period: 'monthly' | 'yearly') => void;
}

const PaymentToggle: React.FC<PaymentToggleProps> = ({ currentPeriod, onToggle }) => {
  
  // Wbudowany styl, który zapewni efekt "przesuwania" tła.
  const isMonthly = currentPeriod === 'monthly';

  return (
    <div className="flex justify-center mb-10">
      <div 
        className="relative flex p-1 bg-gray-100 rounded-full shadow-inner cursor-pointer"
        // Logika kliknięcia: przełączamy się na przeciwny tryb
        onClick={() => onToggle(isMonthly ? 'yearly' : 'monthly')}
      >
        
        {/* Tło przełącznika, które animuje się po kliknięciu */}
        <div 
          className={`absolute top-1 bottom-1 w-1/2 bg-blue-600 rounded-full shadow-md transition-all duration-300 ease-in-out`}
          style={{ transform: isMonthly ? 'translateX(0%)' : 'translateX(100%)' }}
        />

        {/* Opcja Miesięczna */}
        <button
          type="button"
          className={`z-10 px-6 py-2 text-sm font-medium rounded-full transition-colors duration-300 ${isMonthly ? 'text-white' : 'text-gray-700 hover:text-gray-900'}`}
          onClick={() => onToggle('monthly')}
        >
          Miesięcznie
        </button>

        {/* Opcja Roczna */}
        <button
          type="button"
          className={`z-10 px-6 py-2 text-sm font-medium rounded-full transition-colors duration-300 ${isMonthly ? 'text-gray-700 hover:text-gray-900' : 'text-white'}`}
          onClick={() => onToggle('yearly')}
        >
          Rocznie
        </button>
      </div>
    </div>
  );
};

export default PaymentToggle;// Eksportujemy komponent, aby można go było używać w innych miejscach aplikacji

