import React from 'react';

// Interfejs (definicja typów) dla wszystkich danych, jakie ten komponent przyjmuje
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
  // Opcjonalne pole, używane do wyświetlania mniejszej ceny miesięcznej pod ceną roczną
  subPrice?: number | null; 
  // Opcjonalne pole, używane do wyświetlania mniejszej jednostki
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
  
  // Warunkowe style dla wyróżnienia Planu PRO (Najpopularniejszy)
  // Używamy białego tła dla wszystkich, ale PRO ma wyraźną niebieską ramkę
  const primaryClasses = isPrimary
    ? 'bg-white relative ring-4 ring-blue-500 shadow-xl scale-[1.02] transform transition duration-300'
    : 'bg-white shadow-lg relative';
  
  // Style przycisków
  const buttonClasses = isPrimary
    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' // Plan PRO: Niebieski
    : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300'; // Pozostałe: Jasnoszary

  return (
    // Główny kontener kafelek
    <div className={`flex flex-col rounded-xl p-8 transition duration-300 ease-in-out ${primaryClasses}`}>
      
      {/* Oznaczenie "Najpopularniejszy" */}
      {isPrimary && (
        <p className="absolute top-0 right-0 -mt-4 mr-4 rounded-full bg-blue-600 px-3 py-1 text-sm font-semibold uppercase tracking-wider text-white shadow-md">
          Najpopularniejszy
        </p>
      )}

      {/* Tytuł i Podtytuł */}
      <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500 min-h-[40px]">{subtitle}</p>

      {/* Sekcja Ceny */}
      <div className="mt-4 flex items-baseline">
        <span className="text-5xl font-extrabold tracking-tight text-gray-900">
          {price}
        </span>
        <span className="ml-1 text-xl font-medium text-gray-600">
          {priceUnit}
        </span>
        <span className="ml-2 text-base text-gray-500">
          {period}
        </span>
      </div>
      
      {/* CENA MIESIĘCZNA POD CENĄ ROCZNĄ (NOWA LOGIKA) */}
      {subPrice && subPriceUnit && (
        <p className="mt-1 text-sm text-gray-500">
          {subPrice} {subPriceUnit}
        </p>
      )}

      {/* Sekcja Oszczędności (Savings) */}
      {savings && (
        <p className="mt-1 text-xs font-semibold text-green-600 italic">
          {savings}
        </p>
      )}

      {/* Separator */}
      <div className="mt-6 flex-1">
        <ul role="list" className="space-y-4">
          {/* Mapujemy przez listę cech (features) */}
          {features.map((feature) => (
            <li key={feature} className="flex items-start">
              <div className="flex-shrink-0">
                {/* Ikona SVG dla cechy */}
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
        href="#" // Link do formularza/płatności
        className={`mt-8 block w-full py-3 px-6 border border-transparent rounded-lg text-center font-medium transition duration-150 ease-in-out ${buttonClasses}`}
      >
        {buttonText}
      </a>
    </div>
  );
};

export default PriceCard; // Eksportujemy komponent, aby można go było używać w innych miejscach aplikacji