import React from 'react';
// Importujemy komponent PriceCard
import PriceCard from './components/PriceCard';

// Definicja danych cennika, łącząca warianty płatności
const pricingData = [
  // 1. PAKIET WDROŻENIOWY (Opłata Jednorazowa)
  {
    title: 'Pakiet Wdrożeniowy',
    subtitle: 'Start Bez Frustracji.',
    price: 450, // PLN netto
    priceUnit: 'PLN netto',
    period: 'opłata jednorazowa',
    features: [
      'Przygotowanie aplikacji',
      'Połączenie z kontem Google',
      'Podłączenie Dysku Google',
      'Ustawienie wtyczki na stronie',
      'Pomoc na początku / Dokument wdrożeniowy',
    ],
    isPrimary: false,
    savings: null,
    buttonText: 'Rozpocznij teraz',
  },

  // 2. PAKIET STANDARD (Łączymy roczny i miesięczny)
  {
    title: 'Pakiet STANDARD',
    subtitle: 'Profesjonalizm na Co Dzień. Idealny dla umiarkowanej ilości zdjęć.',
    price: 33, // Miesięczna cena przy płatności rocznej (tańszy wariant)
    priceUnit: 'PLN netto',
    period: 'miesiąc (płatne rocznie)',
    features: [
      'Profesjonalna galeria',
      'Automatyczne porządkowanie zdjęć',
      'Kompresja zdjęć (oszczędność miejsca)',
      'Łatwy panel zarządzania',
      'Wtyczka do Twojej strony internetowej',
      'Bezpieczne przechowywanie danych',
      'Maksymalna przestrzeń: 2 GB',
    ],
    isPrimary: false,
    savings: 'Płacąc rocznie, oszczędzasz 80 zł (2 miesiące gratis!)',
    buttonText: 'Wybieram STANDARD',
    
    // Dane dla przełącznika Miesiąc/Rok, jeśli go dodasz w komponencie PriceCard
    monthlyPrice: 40,
  },

  // 3. PAKIET ROZSZERZONY / PROFI (Najpopularniejszy)
  {
    title: 'Plan PROFI (Najpopularniejszy)',
    subtitle: 'Moc Nielimitowanych Możliwości. Najczęściej wybierany przez Fundacje.',
    price: 50, // Miesięczna cena przy płatności rocznej (tańszy wariant)
    priceUnit: 'PLN netto',
    period: 'miesiąc (płatne rocznie)',
    features: [
      'Nielimitowane możliwości dla galerii',
      'Wszystko z Planu STANDARD',
      'Więcej miejsca na zdjęcia (dla dużych archiwów)',
      'Priorytetowe wsparcie techniczne',
      'Dodatkowe szablony galerii',
    ],
    isPrimary: true, // Plan najpopularniejszy - wyróżniamy go!
    savings: 'Płacąc rocznie, oszczędzasz 120 zł (2 miesiące gratis!)',
    buttonText: 'Wybieram PROFI',
    
    // Dane dla przełącznika Miesiąc/Rok, jeśli go dodasz w komponencie PriceCard
    monthlyPrice: 60,
  },
];

export default function PricingPage() {
  // Pamiętaj: ten komponent PriceCard.tsx musi istnieć, aby to działało!
  return (
    // Używamy stylów z głównej strony Nautil (tło, wyśrodkowanie)
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Nagłówek i opis - używamy tekstu z pliku Word */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Wybierz plan idealny dla siebie
          </h1>
          {/* Opcjonalny opis, którego nie było w nagłówku, ale dobrze jest go dodać */}
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">
            Pełna kontrola nad Twoimi galeriami. Płać elastycznie - co miesiąc lub oszczędzaj, wybierając płatność roczną.
          </p>
        </div>

        {/* Sekcja Kafelków Cennika - Używamy Tailwinda (grid) dla 3 kafelków */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {pricingData.map((plan) => (
            <PriceCard
              key={plan.title}
              title={plan.title}
              subtitle={plan.subtitle}
              price={plan.price}
              priceUnit={plan.priceUnit}
              period={plan.period}
              features={plan.features}
              isPrimary={plan.isPrimary}
              savings={plan.savings}
              buttonText={plan.buttonText}
              // Przekazujemy cenę miesięczną, na wypadek gdybyś chciał później dodać przełącznik
              monthlyPrice={plan.monthlyPrice}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
