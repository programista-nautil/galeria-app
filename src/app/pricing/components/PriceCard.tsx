import React from 'react';

// Interfejs z nowymi opcjonalnymi polami
interface PriceCardProps {
  title: string;
  subtitle: string;
  price: number;
  priceUnit: string;
  period: string;
  features: string[];
  isPrimary: boolean;
  savings?: string | null;
  buttonText: string;
  subPrice?: number | null; 
  subPriceUnit?: string | null;
}

const PriceCard: React.FC<PriceCardProps> = ({
  title,
  subtitle,
  price,
  priceUnit,
  period,
  features,
  isPrimary,
  savings,
  buttonText,
  subPrice,
  subPriceUnit,
}) => {
  
  // 1. Cienie i tło dla kafelków
  const baseClasses = 'flex flex-col rounded-xl p-8 transition duration-500 ease-in-out border border-gray-200 relative';
  
  const primaryClasses = isPrimary
    // PROFI: Mocny cień i niebieska ramka
    ? `${baseClasses} ring-4 ring-blue-500 shadow-2xl scale-[1.02] transform z-10 bg-white` 
    // STANDARD/Wdrożeniowy: Bardziej wyrazisty cień i efekt uniesienia na hoverze
    : `${baseClasses} shadow-xl hover:shadow-2xl hover:scale-[1.01] transform bg-white`; 
  
  // 2. Styl przycisków (FINALNY KONTRAST FIX)
  const buttonClasses = isPrimary
    ? 'bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg font-bold uppercase tracking-wider' // PROFI: Mocny gradient
    
    // STANDARD/Wdrożeniowy: JASNOSZARY przycisk bazowy, który wyraźnie odróżnia się od białej karty (bg-gray-100)
    : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-2 border-gray-300 shadow-sm hover:shadow-md font-medium'; 

  return (
    <div className={primaryClasses}>
      
      {/* Oznaczenie "Najpopularniejszy" */}
      {isPrimary && (
        <p className="absolute top-0 right-0 -mt-4 mr-4 rounded-full bg-blue-600 px-3 py-1 text-sm font-semibold uppercase tracking-wider text-white shadow-md">
          Najpopularniejszy
        </p>
      )}

      
      {/* Tytuł i Podtytuł */}
      <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500 min-h-[40px]">{subtitle}</p>

      {/* Sekcja Głównej Ceny (ROZMIAR KROPNY) */}
      <div className="mt-4 flex items-baseline"> 
        <span className="text-5xl font-extrabold tracking-tight text-gray-900">
          {price}
        </span>
        <span className="ml-1 text-xl font-medium text-gray-600">
          {priceUnit}
        </span>
        <span className="ml-2 text-base text-gray-500">
          ({period})
        </span>
      </div>
      
      {/* CENA MALA (SUBPRICE) - Przeliczenie miesięczne pod dużą ceną roczną */}
      {subPrice && subPriceUnit && (
        <p className="mt-1 text-sm text-gray-500">
          <span className="font-semibold text-gray-700">{subPrice} {priceUnit}</span> {subPriceUnit}
        </p>
      )}

      {/* Sekcja Oszczędności (Savings) */}
      {savings && (
        <p className="mt-1 text-xs font-semibold text-green-600 italic">
          {savings}
        </p>
      )}

      {/* Separator i Cechy */}
      <div className="mt-6 flex-1">
        <ul role="list" className="space-y-4">
          {features.map((feature) => (
            <li key={feature} className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className={`h-6 w-6 ${isPrimary ? 'text-blue-500' : 'text-green-500'}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="ml-3 text-base text-gray-700">{feature}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Przycisk Akcji */}
      <a
        href="#"
        className={`mt-8 block w-full py-3 px-6 border border-transparent rounded-lg text-center font-medium transition duration-150 ease-in-out ${buttonClasses}`}
      >
        {buttonText}
      </a>
    </div>
  );
};

export default PriceCard;
