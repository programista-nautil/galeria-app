"use client"; 

import React, { useState } from 'react';
import PriceCard from './components/PriceCard';
import PaymentToggle from './components/PaymentToggle';
import Link from 'next/link'; 

// Definicja danych cennika (używamy Twojej zaktualizowanej wersji)
const pricingData = [
  // 1. PAKIET WDROŻENIOWY (Opłata Jednorazowa)
  {
    title: 'Pakiet Wdrożeniowy',
    subtitle: 'Start Bez Frustracji.',
    price: 450, 
    priceUnit: 'PLN netto',
    period: 'jednorazowo',
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
    price: 33, 
    priceUnit: 'PLN netto',
    period: 'miesiąc',
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
    title: 'Plan PROFI',
    subtitle: 'Moc Nielimitowanych Możliwości. Najczęściej wybierany przez Fundacje.',
    price: 50, 
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
  
  const [paymentPeriod, setPaymentPeriod] = useState<'monthly' | 'yearly'>('yearly');

  // FUNKCJA DO POBIERANIA AKTUALNYCH DANYCH (Logika cen)
  const getPlanDetails = (plan: PricingPlan) => {
    
    const isYearly = paymentPeriod === 'yearly';
    let finalPrice = plan.price;
    let finalPeriod = plan.period;
    let finalSavings = plan.savings;
    let finalSubPrice: number | undefined = undefined; 
    let finalSubPriceUnit: string | undefined = undefined;

    if (plan.monthlyPrice !== undefined) {
        if (isYearly) {
            finalPrice = plan.price * 12; 
            finalPeriod = 'rocznie'; 
            finalSavings = plan.savings;
            finalSubPrice = plan.price; 
            finalSubPriceUnit = 'miesiąc'; 
        } else {
            finalPrice = plan.monthlyPrice; 
            finalPeriod = 'miesiąc';
            finalSavings = null;
            finalSubPrice = undefined; 
            finalSubPriceUnit = undefined; 
        }
    }

    return {
      price: finalPrice,
      period: finalPeriod,
      savings: finalSavings,
      subPrice: finalSubPrice, 
      subPriceUnit: finalSubPriceUnit, 
    };
  };


  return (
    // Główny kontener strony (bg-slate-50)
    <div className="min-h-screen bg-slate-50"> 
        
        {/* KONTENER WIRTUANY ODPOWIEDZIALNY ZA WYŚRODKOWANIE WSZYSTKIEGO (JAK NA STRONIE GŁÓWNEJ) */}
        <div className='flex-grow container mx-auto'>
            {/* NAGŁÓWEK Z PADDINGAMI (Punkt 5) 
              Nie ma tu klasy 'container mx-auto', by unikać podwójnego centrowania.
            */}
            <header className='px-4 sm:px-6 lg:px-16 py-6 lg:py-8 shrink-0'>
                <Link href='/'>
                    <img src={'/nautil-logo-czarne.svg'} alt='Logo Nautil' className='h-12 w-auto' />
                </Link>
            </header>

            {/* GŁÓWNA TREŚĆ STRONY (wyśrodkowany cennik) */}
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
                                price={details.price} 
                                period={details.period}
                                savings={details.savings}
                                subPrice={details.subPrice} 
                                subPriceUnit={details.subPriceUnit} 
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    </div>
  );
}
