import React from 'react';

// Interfejs (definicja typów) - zostaje bez zmian
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

// Główny komponent kafelka cennika
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
  
  // Warunkowe style dla wyróżnienia Planu PROFI
  const baseClasses = 'flex flex-col rounded-xl p-8 transition duration-300 ease-in-out border border-gray-200 relative';
  
  // Mocniejsze style dla Planu PROFI (isPrimary)
  const primaryClasses = isPrimary
    ? 'bg-blue-600/5 ring-2 ring-blue-600 shadow-xl scale-[1.02] transform' // Lekko niebieskie tło, mocna ramka
    : 'bg-white shadow-lg hover:shadow-xl hover:scale-[1.01]'; // Białe tło, wyraźny cień
    
  // Style przycisków
  const buttonClasses = isPrimary
    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg font-bold' // Plan PROFI: Mocny niebieski
    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 font-medium'; // Reszta: Czysty, jasny przycisk

  // ******* ZMIANY TUTAJ: Poprawa kontrastu dla isPrimary (WCAG) *******
  const titleColor = 'text-gray-900';
  const subtitleColor = isPrimary ? 'text-gray-600' : 'text-gray-500';
  const priceColor = 'text-gray-900'; // ZAWSZE CIEMNY
  const priceUnitColor = isPrimary ? 'text-gray-700' : 'text-gray-600'; // CIEMNIEJSZY NIŻ WCZEŚNIEJ
  const periodColor = isPrimary ? 'text-gray-600' : 'text-gray-500'; // CIEMNIEJSZY NIŻ WCZEŚNIEJ
  const featureTextColor = 'text-gray-700';
  // ******* KONIEC ZMIAN *******

  return (
    // Główny kontener kafelek
    <div className={`${baseClasses} ${primaryClasses}`}>
      
      {/* Oznaczenie "Najpopularniejszy" */}
      {isPrimary && (
        <p className="absolute top-0 right-0 -mt-4 mr-4 rounded-full bg-blue-600 px-3 py-1 text-sm font-semibold uppercase tracking-wider text-white shadow-md">
          Najpopularniejszy
        </p>
      )}

      
      {/* Tytuł i Podtytuł */}
      <h3 className={`text-2xl font-extrabold ${titleColor}`}>{title}</h3>
      <p className={`mt-2 text-sm ${subtitleColor} min-h-[40px]`}>{subtitle}</p>

      {/* Sekcja Głównej Ceny - teraz ZAWSZE CIEMNA */}
      <div className="mt-4 flex items-baseline">
        <span className={`text-5xl font-extrabold tracking-tight ${priceColor}`}>
          {price}
        </span>
        <span className={`ml-1 text-xl font-medium ${priceUnitColor}`}>
          {priceUnit}
        </span>
        <span className={`ml-2 text-base ${periodColor}`}>
          {period}
        </span>
      </div>
      
      {/* CENA PEŁNA ROCZNA (subPrice) - Dyskretny, ale czytelny dopisek */}
      {subPrice && subPriceUnit && (
        <p className="mt-1 text-sm text-gray-500">
          <span className="font-semibold text-gray-700">{subPrice}</span> {subPriceUnit}
        </p>
      )}

      {/* Sekcja Oszczędności (Savings) - Używamy zielonego koloru dla pozytywnego akcentu */}
      {savings && (
        <p className="mt-2 text-xs font-semibold text-green-700 italic">
          {savings}
        </p>
      )}

      {/* Separator / Lista Cech */}
      <div className="mt-6 flex-1 pt-4 border-t border-gray-100"> 
        <ul role="list" className="space-y-4">
          {features.map((feature) => (
            <li key={feature} className="flex items-start">
              <div className="flex-shrink-0">
                {/* Ikona SVG dla cechy - zostaje niebieski, bo to mały, niekrytyczny akcent */}
                <svg
                  className={`h-6 w-6 text-blue-600`}
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
              <p className={`ml-3 text-base ${featureTextColor}`}>{feature}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Przycisk Akcji */}
      <a
        href="#"
        className={`mt-8 block w-full py-3 px-6 border border-transparent rounded-lg text-center transition duration-150 ease-in-out ${buttonClasses}`}
      >
        {buttonText}
      </a>
    </div>
  );
};

export default PriceCard;