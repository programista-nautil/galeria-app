"use client";

import React, { useState } from 'react';
import PriceCard from './components/PriceCard';
import PaymentToggle from './components/PaymentToggle';

// Definicja danych cennika
const pricingData = [
  // 1. PAKIET WDROŻENIOWY (Opłata Jednorazowa)
  {
    title: 'Pakiet Wdrożenie',
    subtitle: 'Start Bez Frustracji. Oferujemy pełną pomoc i wsparcie, abyś mógł rozpocząć od razu.',
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
    title: 'Plan PROFI',
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

type PricingPlan = typeof pricingData[0] & { monthlyPrice?: number };

export default function PricingPage() {
  const [paymentPeriod, setPaymentPeriod] = useState<'monthly' | 'yearly'>('yearly');

  const getPlanDetails = (plan: PricingPlan) => {
    
    const isYearly = paymentPeriod === 'yearly';
    let finalPrice = plan.price;
    let finalPeriod = plan.period;
    let finalSavings = plan.savings;

    // Obliczanie pełnej kwoty rocznej dla użytkowników wybierających płatność roczną
    let finalSubPrice: number | undefined = undefined; // NOWY STAN
    let finalSubPriceUnit: string | undefined = undefined; // NOWY STAN

    if (plan.monthlyPrice !== undefined) {
        if (isYearly) {
            // Cena roczna (niższa, z oszczędnościami)
            finalPrice = plan.price; // np. 33
            finalPeriod = 'miesiąc (płatne rocznie)';
            finalSavings = plan.savings;
            
            // NOWA LOGIKA: Obliczamy pełną kwotę roczną dla wyświetlenia jako dopisek
            finalSubPrice = plan.price * 12; // np. 33 * 12 = 396
            finalSubPriceUnit = `PLN netto (kwota roczna)`;
        } else {
            // Cena miesięczna (wyższa, bez oszczędności)
            finalPrice = plan.monthlyPrice; // np. 40
            finalPeriod = 'miesiąc (płatne co miesiąc)';
            finalSavings = null;
        }
    }

    return {
      price: finalPrice,
      period: finalPeriod,
      savings: finalSavings,
      // Przekazuję nowe opcjonalne pola
      subPrice: finalSubPrice,
      subPriceUnit: finalSubPriceUnit,
    };
  };


  return (
    // Zmieniam tło na białe i w kontenerze dodajemy ciemne kolory dla motywu Nautil
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Nagłówek i opis - Zmieniamy kolory na ciemniejsze, żeby pasowały do jasnego tła */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Wybierz plan idealny dla siebie
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-600">
            Pełna kontrola nad Twoimi galeriami. Płać elastycznie - co miesiąc lub oszczędzaj, wybierając płatność roczną.
          </p>
        </div>

        {/* 3. WŁĄCZENIE KOMPONENTU PRZEŁĄCZNIKA - pozostawiamy bez zmian */}
        <PaymentToggle 
          currentPeriod={paymentPeriod} 
          onToggle={setPaymentPeriod}
        />

        {/* Sekcja Kafelków Cennika */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 items-stretch"> 
          {pricingData.map((plan) => {
            const details = getPlanDetails(plan as PricingPlan);
            return (
              <PriceCard
                key={plan.title}
                title={plan.title}
                subtitle={plan.subtitle}
                
                // Używam dynamicznych wartości
                price={details.price}
                period={details.period}
                savings={details.savings}
                
                // Używam nowych, opcjonalnych wartości
                subPrice={details.subPrice}
                subPriceUnit={details.subPriceUnit}
                
                // Używam stałych wartości
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