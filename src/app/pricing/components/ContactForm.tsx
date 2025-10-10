// app/pricing/components/ContactForm.tsx
"use client";

import React, { useState } from "react";

// Typy formularza
interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
}

type FormErrors = Partial<Record<keyof FormData | "form", string>>;

// Komponent pojedynczego pola (przeniesiony na zewnątrz ContactForm)
interface InputFieldProps {
  name: keyof FormData;
  type?: string;
  placeholder: string;
  required?: boolean;
  isTextArea?: boolean;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  type = "text",
  placeholder,
  required,
  isTextArea = false,
  value,
  error,
  onChange,
}) => {
  const borderClass = error ? "border-red-500" : "border-gray-400";

  return (
    <div>
      {isTextArea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#0E47C2] focus:border-transparent transition duration-200 
                       placeholder:text-gray-600 border ${borderClass} focus:ring-offset-2 text-gray-900`}
          rows={4}
          required={required}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#0E47C2] focus:border-transparent transition duration-200 
                       placeholder:text-gray-600 border ${borderClass} focus:ring-offset-2 text-gray-900`}
          required={required}
        />
      )}
      {error && <p className="mt-1 text-sm text-red-500 font-medium">{error}</p>}
    </div>
  );
};

// Główny komponent formularza
const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
    consent: false,
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<FormErrors>({});

  // Walidacja pojedynczego pola
  const validateField = (name: keyof FormData, value: string | boolean): string | null => {
    if (name === "consent") return value ? null : "Musisz wyrazić zgodę na przetwarzanie danych.";
    if (name === "name" && typeof value === "string" && value.trim().length > 0 && value.trim().length < 2)
      return "Imię i Nazwisko jest za krótkie.";
    if (name === "email" && typeof value === "string" && value.trim().length > 0 && !value.includes("@"))
      return "Wprowadź prawidłowy adres e-mail.";
    return null;
  };

  // Zmiana pola
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const { name } = target;
    const key = name as keyof FormData;
    const inputVal =
      target.type === "checkbox" ? (target as HTMLInputElement).checked : target.value;

    setFormData((prev) => ({
      ...prev,
      [key]: inputVal,
    }));

    const error = validateField(key, inputVal);
    setErrors((prev) => ({ ...prev, [key]: error }));
  };

  // Walidacja całego formularza
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    const requiredFields: (keyof FormData)[] = ["name", "email", "consent"];

    requiredFields.forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    if (formData.name.trim() === "") {
      newErrors.name = "Imię i Nazwisko jest wymagane.";
      isValid = false;
    }
    if (formData.email.trim() === "") {
      newErrors.email = "Adres e-mail jest wymagany.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Czy przycisk aktywny
  const isFormReady =
    formData.consent && formData.name.trim().length >= 2 && formData.email.includes("@");

  // Obsługa wysyłki
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrors({});

    const payload = {
      ...formData,
      subject: `Zapytanie o ofertę: ${formData.name} jest zainteresowany kontaktem.`,
    };
    
        try {
    const response = await fetch("/api/sendmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", phone: "", message: "", consent: false });
    } else {
        setStatus("error");
    }
    } catch (error) {
    console.error("Wystąpił błąd sieci:", error);
    setStatus("error");
    }
  };

  // JSX formularza
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto bg-white p-8 rounded-xl shadow-xl border border-gray-100"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
        Formularz Zamówienia Oferty
      </h3>

      {status === "success" && (
        <p className="mb-4 text-center text-sm font-semibold text-green-600 bg-green-50 p-2 rounded-lg">
          ✅ Wiadomość wysłana! Potwierdzenie otrzymasz na maila.
        </p>
      )}
      {status === "error" && (
        <p className="mb-4 text-center text-sm font-semibold text-red-600 bg-red-50 p-2 rounded-lg">
          ❌ Błąd. Proszę, popraw zaznaczone pola i zaznacz zgodę na przetwarzanie danych.
        </p>
      )}

      {/* Pola formularza */}
      <div className="space-y-4">
        <InputField
          key="name"
          name="name"
          placeholder="Imię i Nazwisko"
          required
          value={formData.name}
          error={errors.name}
          onChange={handleChange}
        />
        <InputField
          key="email"
          name="email"
          type="email"
          placeholder="Adres e-mail"
          required
          value={formData.email}
          error={errors.email}
          onChange={handleChange}
        />
        <InputField
          key="phone"
          name="phone"
          type="tel"
          placeholder="Numer telefonu (opcjonalnie)"
          value={formData.phone}
          error={errors.phone}
          onChange={handleChange}
        />
        <InputField
          key="message"
          name="message"
          placeholder="Treść wiadomości (np. specyficzne pytania)"
          isTextArea
          value={formData.message}
          error={errors.message}
          onChange={handleChange}
        />
      </div>

      {/* Checkbox */}
      <div className="mt-6">
        <label className="flex items-start text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            name="consent"
            checked={formData.consent}
            onChange={handleChange}
            className="mt-1 mr-3 h-4 w-4 text-[#0E47C2] border-gray-400 rounded focus:ring-2 focus:ring-[#0E47C2] focus:ring-offset-2"
            required
            aria-required="true"
          />
          <span className="leading-tight">
            Wyrażam zgodę na przetwarzanie moich danych osobowych (imię, e-mail, telefon) wyłącznie
            w celu kontaktu i obsługi niniejszego zapytania ofertowego. Firma Nautil nie przechowuje
            ani nie udostępnia zebranych danych.
          </span>
        </label>
        {errors.consent && (
          <p className="mt-1 text-sm text-red-500 font-medium">{errors.consent}</p>
        )}
      </div>

      {/* Przycisk */}
      <button
        type="submit"
        disabled={!isFormReady || status === "loading"}
        className={`mt-6 w-full py-3 text-base font-semibold rounded-xl transition duration-500 transform shadow-md
        ${
          !isFormReady
            ? "text-gray-500 border-2 border-gray-300 bg-gray-100 cursor-not-allowed shadow-none"
            : "border-2 border-[#0E47C2] text-[#0E47C2] bg-transparent hover:bg-[#155DFC] hover:text-white hover:border-[#155DFC] hover:shadow-xl hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-[#155DFC] focus:ring-offset-2"
        }`}
      >
        {status === "loading" ? "Wysyłanie..." : "Wyślij zapytanie"}
      </button>
    </form>
  );
};

export default ContactForm;
