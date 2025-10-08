// app/pricing/page.tsx (W pełni poprawiony)

"use client"; // Włączam tryb klienta dla tego pliku

import React, { useState } from 'react';
import PriceCard from './components/PriceCard';
import PaymentToggle from './components/PaymentToggle';
import Link from 'next/link'; // <--- NOWY IMPORT DLA LOGO/LINKU

// Definicja danych cennika (bez zmian, używamy danych z pliku)
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
  },

  // 2. PAKIET STANDARD 
  {
    title: 'Pakiet STANDARD',
    subtitle: 'Profesjonalizm na Co Dzień. Idealny dla umiarkowanej ilości zdjęć.',
    price: 33, // Miesięczna cena przy płatności rocznej
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

  // 3. PAKIET PROFI (Najpopularniejszy)
  {
    title: 'Plan PROFI (Najpopularniejszy)',
    subtitle: 'Moc Nielimitowanych Możliwości. Najczęściej wybierany przez Fundacje.',
    price: 50, // Miesięczna cena przy płatności rocznej
    priceUnit: 'PLN netto',
    period: 'miesiąc (płatne rocznie)',
    features: [
      'Nielimitowane możliwości dla galerii',
      'Wszystko z Planu STANDARD',
      'Więcej miejsca na zdjęcia (dla dużych archiwów)',
      'Priorytetowe wsparcie techniczne',
      'Dodatkowe szablony galerii',
    ],
    isPrimary: true,
    savings: 'Płacąc rocznie, oszczędzasz 120 zł (2 miesiące gratis!)',
    buttonText: 'Wybieram PROFI',
    monthlyPrice: 60,
  },
];

type PricingPlan = typeof pricingData[0] & { monthlyPrice?: number };

export default function PricingPage() {
  
  // STAN: Domyślnie ustawiamy płatność roczną ('yearly') [cite: 75, 76]
  const [paymentPeriod, setPaymentPeriod] = useState<'monthly' | 'yearly'>('yearly');

  // FUNKCJA DO POBIERANIA AKTUALNYCH DANYCH (Punkt 4: Odwrócenie logiki cen)
  const getPlanDetails = (plan: PricingPlan) => {
    
    const isYearly = paymentPeriod === 'yearly';
    let finalPrice = plan.price;
    let finalPeriod = plan.period;
    let finalSavings = plan.savings;
    // Nowe pola do wyświetlania mniejszej ceny
    let finalSubPrice: number | undefined = undefined; 
    let finalSubPriceUnit: string | undefined = undefined;

    if (plan.monthlyPrice !== undefined) {
        if (isYearly) {
            // CENA GŁÓWNA (DUŻA): Pełna kwota roczna
            finalPrice = plan.price * 12; // np. 33 * 12 = 396
            finalPeriod = 'kwota roczna'; 
            finalSavings = plan.savings;
            
            // CENA MALA (SUBPRICE): Przeliczenie miesięczne (np. 33)
            finalSubPrice = plan.price; 
            finalSubPriceUnit = 'miesiąc (płatne rocznie)'; 
        } else {
            // Cena miesięczna (wyższa, bez oszczędności)
            finalPrice = plan.monthlyPrice; 
            finalPeriod = 'miesiąc (płatne co miesiąc)';
            finalSavings = null;
            finalSubPrice = undefined; 
            finalSubPriceUnit = undefined; 
        }
    }
    // Pakiet Wdrożeniowy (jednorazowy) pozostaje bez zmian

    return {
      price: finalPrice,
      period: finalPeriod,
      savings: finalSavings,
      subPrice: finalSubPrice, // Przekazujemy do PriceCard
      subPriceUnit: finalSubPriceUnit, // Przekazujemy do PriceCard
    };
  };


  return (
    <div className="min-h-screen bg-slate-50"> 
        
        {/* NAGŁÓWEK I LOGO (Punkt 5 i część Punktu 2) */}
        <header className='container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8'>
          <Link href='/'>
            <img src={'/nautil-logo-czarne.svg'} alt='Logo Nautil' className='h-12 w-auto' />
          </Link>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          
          {/* Nagłówek i opis */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Wybierz plan idealny dla siebie
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">
              Pełna kontrola nad Twoimi galeriami. Płać elastycznie - co miesiąc lub oszczędzaj, wybierając płatność roczną.
            </p>
          </div>

          {/* PRZEŁĄCZNIK */}
          <PaymentToggle 
            currentPeriod={paymentPeriod} 
            onToggle={setPaymentPeriod} 
          />

          {/* Sekcja Kafelków Cennika */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {pricingData.map((plan) => {
              const details = getPlanDetails(plan as PricingPlan);
              return (
                <PriceCard
                  key={plan.title}
                  title={plan.title}
                  subtitle={plan.subtitle}
                  priceUnit={plan.priceUnit}
                  features={plan.features}
                  isPrimary={plan.isPrimary}
                  buttonText={plan.buttonText}
                  
                  // Używamy dynamicznych wartości i nowych propsów
                  price={details.price} 
                  period={details.period}
                  savings={details.savings}
                  subPrice={details.subPrice} // NOWY PROP
                  subPriceUnit={details.subPriceUnit} // NOWY PROP
                />
              );
            })}
          </div>
        </div>
      </div>
  );
}