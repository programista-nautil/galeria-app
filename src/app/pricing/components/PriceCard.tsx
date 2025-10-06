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
  // Zwiększamy padding do p-10 (więcej "powietrza")
  const baseClasses = 'flex flex-col rounded-xl p-10 transition duration-500 ease-in-out border border-gray-200 relative';
  
  // Mocniejsze style dla Planu PROFI (isPrimary) - użycie gradientu dla lepszego efektu
  const primaryClasses = isPrimary
    // gradient-to-br i customowe kolory tła w css (zastępujemy go w Tailwind)
    ? 'bg-gradient-to-br from-blue-50 to-white ring-2 ring-blue-600 shadow-2xl scale-[1.04] transform z-10' 
    // Plan Wdrożeniowy i Standard: delikatne tło, wyraźny cień, efekt hover
    : 'bg-gray-50 shadow-xl hover:shadow-2xl hover:scale-[1.02] transform'; 
    
  // Style przycisków - mocniejszy cień dla PROFI
  const buttonClasses = isPrimary
    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/50 shadow-xl font-bold uppercase tracking-wider' 
    : 'bg-gray-200 hover:bg-gray-300 text-gray-800 border-2 border-transparent font-medium';

  // Kolory tekstu (z WCAG fix, ale dopasowane do nowych, mocniejszych stylów)
  const titleColor = 'text-gray-900';
  const subtitleColor = isPrimary ? 'text-gray-700' : 'text-gray-500';
  const priceColor = 'text-gray-900'; 
  const priceUnitColor = isPrimary ? 'text-gray-700' : 'text-gray-600'; 
  const periodColor = isPrimary ? 'text-gray-600' : 'text-gray-500'; 
  const featureTextColor = 'text-gray-700';

  return (
    // Główny kontener kafelek
    <div className={`${baseClasses} ${primaryClasses}`}>
      
      {/* Oznaczenie "Najpopularniejszy" - dodajemy mocniejszy cień */}
      {isPrimary && (
        <p className="absolute top-0 right-0 -mt-4 mr-4 rounded-full bg-blue-600 px-3 py-1 text-sm font-semibold uppercase tracking-wider text-white shadow-xl">
          Najpopularniejszy
        </p>
      )}

      
      {/* Tytuł i Podtytuł - zwiększamy rozmiar tytułu do text-2xl/3xl i minimalną wysokość na równe karty */}
      <h3 className={`text-3xl font-extrabold ${titleColor}`}>{title}</h3>
      <p className={`mt-2 text-base ${subtitleColor} min-h-[40px] leading-snug`}>{subtitle}</p>

      {/* ---------------------------------------------------- */}
      {/* SEKCJA GŁÓWNEJ CENY - POPRAWIONE WYRÓWNANIE! */}
      {/* Używamy flex items-start, a mniejsze teksty są w kolumnie */}
      <div className="mt-6 flex items-start">
        {/* 1. Główna, duża cena */}
        <span className={`text-6xl font-extrabold tracking-tight ${priceColor}`}>
          {price}
        </span>
        
        {/* 2. Małe napisy (jednostka i okres) w kolumnie, wyrównane do góry */}
        <div className="ml-2 flex flex-col pt-1"> 
          {/* Jednostka - nieco mniejsza (text-xl) */}
          <span className={`text-xl font-medium ${priceUnitColor} whitespace-nowrap`}> 
            {priceUnit}
          </span>
          {/* Okres - najmniejszy (text-sm) */}
          <span className={`text-sm ${periodColor} whitespace-nowrap`}> 
            {period}
          </span>
        </div>
      </div>
      {/* ---------------------------------------------------- */}
      
      {/* CENA PEŁNA ROCZNA (subPrice) */}
      {subPrice && subPriceUnit && (
        <p className="mt-2 text-sm text-gray-500">
          <span className="font-semibold text-gray-700">{subPrice}</span> {subPriceUnit}
        </p>
      )}

      {/* Sekcja Oszczędności (Savings) */}
      {savings && (
        <p className="mt-3 text-sm font-semibold text-green-700 italic">
          {savings}
        </p>
      )}

      {/* Separator / Lista Cech - Więcej odstępu i grubsza linia */}
      <div className="mt-8 flex-1 pt-6 border-t border-gray-200"> 
        <ul role="list" className="space-y-4">
          {features.map((feature) => (
            <li key={feature} className="flex items-start">
              <div className="flex-shrink-0">
                {/* Ikona SVG dla cechy - Zostawiamy niebieską */}
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

      {/* Przycisk Akcji - Dodajemy większy padding wertykalny (py-4) */}
      <a
        href="#"
        className={`mt-10 block w-full py-4 px-6 border border-transparent rounded-lg text-center transition duration-150 ease-in-out ${buttonClasses}`}
      >
        {buttonText}
      </a>
    </div>
  );
};

export default PriceCard;