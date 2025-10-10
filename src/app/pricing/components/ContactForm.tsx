// app/pricing/components/ContactForm.tsx
"use client";

import React, { useState } from 'react';

// Definicja początkowego stanu formularza
interface FormData {
    name: string;
    email: string;
    phone: string;
    message: string;
    consent: boolean;
}

const ContactForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        message: '',
        consent: false,
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    
    // Walidacja, czy formularz jest gotowy do wysłania
    const isFormValid = formData.consent && 
                        formData.name.trim() !== '' && 
                        formData.email.includes('@');

    // Obsługa zmiany stanu pól formularza
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Obsługa wysyłki formularza (API Route)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isFormValid) {
            setStatus('error');
            return;
        }

        setStatus('loading');
        
        const payload = {
            ...formData,
            subject: `Zapytanie o ofertę Nautil Galeria od ${formData.name}`,
        };

        try {
            // TUTAJ BĘDZIE PRAWIDŁOWY ENDPOINT
            const response = await fetch('/api/sendmail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', phone: '', message: '', consent: false });
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error("Wystąpił błąd sieci:", error);
            setStatus('error');
        }
    };

    return (
        // GŁÓWNY KONTENER: Stylizowany na kartę, ale z subtelnym designem
        <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto bg-white p-8 rounded-xl shadow-xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Zamów Ofertę i Kontakt</h3>

            {/* STAN WIADOMOŚCI */}
            {status === 'success' && (
                <p className="mb-4 text-center text-sm font-semibold text-green-600 bg-green-50 p-2 rounded-lg">
                    🚀 Wiadomość wysłana! Potwierdzenie otrzymasz na maila.
                </p>
            )}
            {status === 'error' && (
                <p className="mb-4 text-center text-sm font-semibold text-red-600 bg-red-50 p-2 rounded-lg">
                    ❌ Błąd. Sprawdź pola formularza i zgodę marketingową.
                </p>
            )}
            
            {/* POLA FORMULARZA: Z niebieskim focus ring */}
            <div className="space-y-4">
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Imię i Nazwisko"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0E47C2] focus:border-transparent"
                    required
                />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Adres e-mail"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0E47C2] focus:border-transparent"
                    required
                />
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Numer telefonu (opcjonalnie)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0E47C2] focus:border-transparent"
                />
                <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Treść wiadomości (np. specyficzne pytania)"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0E47C2] focus:border-transparent"
                ></textarea>
            </div>

            {/* CHECKBOX ZGODY (Walidacja i WCAG) */}
            <div className="mt-6">
                <label className="flex items-start text-sm text-gray-600 cursor-pointer">
                    <input
                        type="checkbox"
                        name="consent"
                        checked={formData.consent}
                        onChange={handleChange}
                        // Style WCAG: niebieski kolor przy zaznaczeniu i focus ring
                        className="mt-1 mr-3 h-4 w-4 text-[#0E47C2] border-gray-300 rounded focus:ring-2 focus:ring-[#0E47C2]"
                        required
                        aria-required="true"
                    />
                    <span className="leading-tight">
                        Wyrażam zgodę na przetwarzanie moich danych osobowych (imię, e-mail, telefon) w celu obsługi niniejszego zapytania ofertowego i dalszego kontaktu.
                    </span>
                </label>
            </div>

            {/* PRZYCISK WYSYŁKI: Stylizowany na przezroczysty z niebieską ramką */}
            <button
                type="submit"
                disabled={!isFormValid || status === 'loading'}
                // Style naśladujące przycisk 'Napisz do nas': przezroczysty, niebieska ramka, dynamiczny hover
                className={`mt-6 w-full py-3 text-base font-semibold rounded-xl transition duration-500 transform shadow-md
                    ${!isFormValid 
                        // STAN WYŁĄCZONY: Szara ramka, szary tekst, brak interakcji
                        ? 'text-gray-500 border-2 border-gray-300 bg-gray-100 cursor-not-allowed shadow-none' 
                        // STAN AKTYWNY: Niebieska ramka i tekst, przezroczyste tło, efekt hover z niebieskim tłem
                        : 'border-2 border-[#0E47C2] text-[#0E47C2] bg-transparent hover:bg-[#155DFC] hover:text-white hover:border-[#155DFC] hover:shadow-xl hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-[#155DFC] focus:ring-offset-2'
                }`}
            >
                {status === 'loading' ? 'Wysyłanie...' : 'Wyślij zapytanie'}
            </button>
        </form>
    );
};

export default ContactForm;