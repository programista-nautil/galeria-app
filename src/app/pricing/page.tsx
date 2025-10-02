"use client"; // Włączam tryb klienta dla tego pliku

import React, { useState } from 'react';
import PriceCard from './components/PriceCard';
import PaymentToggle from './components/PaymentToggle'; // Importujemy nowy komponent

// Definicja danych cennika
const pricingData = [
  // 1. PAKIET WDROŻENIOWY (Opłata Jednorazowa)
  {
    title: 'Pakiet Wdrożeniowy',
    subtitle: 'Start Bez Frustracji.',
    price: 450, 
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
    // WAŻNE: Nie ma monthlyPrice, więc będzie traktowane jako undefined.
    // Logika w getPlanDetails musi to obsłużyć.
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
    monthlyPrice: 60,
  },
];

// Musimy zadeklarować typ, który zawiera price i opcjonalnie monthlyPrice,
// aby TypeScript wiedział, jak się do niego odwołać.
type PricingPlan = typeof pricingData[0] & { monthlyPrice?: number };


export default function PricingPage() {
  // 1. STAN: Domyślnie ustawiamy płatność roczną (tańszą)
  const [paymentPeriod, setPaymentPeriod] = useState<'monthly' | 'yearly'>('yearly');

  // 2. FUNKCJA DO POBIERANIA AKTUALNYCH DANYCH - uzywamy PricingPlan jako typu
  const getPlanDetails = (plan: PricingPlan) => {
    
    // Dla wszystkich planów: dynamiczna zmiana cen na podstawie stanu
    const isYearly = paymentPeriod === 'yearly';
    
    // Logika ceny:
    let finalPrice = plan.price;
    let finalPeriod = plan.period;
    let finalSavings = plan.savings;

    // Próba przełączenia ceny TYLKO jeśli plan ma opcję miesięczną (monthlyPrice)
    if (plan.monthlyPrice !== undefined) {
        if (isYearly) {
            // Cena roczna (niższa, z oszczędnościami)
            finalPrice = plan.price;
            finalPeriod = 'miesiąc (płatne rocznie)';
            finalSavings = plan.savings;
        } else {
            // Cena miesięczna (wyższa, bez oszczędności)
            finalPrice = plan.monthlyPrice;
            finalPeriod = 'miesiąc (płatne co miesiąc)';
            finalSavings = null;
        }
    }
    // Jeśli monthlyPrice jest undefined (np. Pakiet Wdrożeniowy), zostawiamy finalPrice = plan.price, 
    // a period i savings zostają stałe (tak jak są zdefiniowane w pricingData).

    return {
      price: finalPrice,
      period: finalPeriod,
      savings: finalSavings,
    };
  };


  return (
    // Używamy stylów z głównej strony Nautil (tło, wyśrodkowanie)
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Nagłówek i opis */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Wybierz plan idealny dla siebie
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">
            Pełna kontrola nad Twoimi galeriami. Płać elastycznie - co miesiąc lub oszczędzaj, wybierając płatność roczną.
          </p>
        </div>

        {/* 3. WŁĄCZENIE KOMPONENTU PRZEŁĄCZNIKA */}
        <PaymentToggle 
          currentPeriod={paymentPeriod} 
          onToggle={setPaymentPeriod} // Przekazujemy funkcję do zmiany stanu
        />

        {/* Sekcja Kafelków Cennika */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {pricingData.map((plan) => {
            // 4. Używamy dynamicznych detali cen
            const details = getPlanDetails(plan as PricingPlan); 
            
            return (
              <PriceCard
                key={plan.title}
                title={plan.title}
                subtitle={plan.subtitle}
                
                // 5. Używamy dynamicznych wartości
                price={details.price} // ZAWSZE jest liczbą dzięki poprawce w getPlanDetails
                period={details.period}
                savings={details.savings}
                
                // Używamy stałych wartości
                priceUnit={plan.priceUnit}
                features={plan.features}
                isPrimary={plan.isPrimary}
                buttonText={plan.buttonText}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
