import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message, consent } = body;

    if (!consent) {
      return new Response(JSON.stringify({ error: "Brak zgody na przetwarzanie danych." }), {
        status: 400,
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // E-mail do Ciebie
    const mailToAdmin = {
      from: `"Formularz Nautil" <${process.env.SMTP_EMAIL}>`,
      to: process.env.SMTP_EMAIL,
      subject: `Nowe zapytanie od ${name}`,
      text: `
Imię i nazwisko: ${name}
Email: ${email}
Telefon: ${phone || "nie podano"}
Wiadomość:
${message}
      `,
    };

    // E-mail potwierdzający do użytkownika
    const mailToUser = {
      from: `"Nautil" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: "Dziękujemy za kontakt",
      text: `
Cześć ${name},

Dziękujemy za przesłanie zapytania do firmy Nautil.
Wkrótce się z Tobą skontaktujemy.

Treść Twojej wiadomości:
"${message}"

Pozdrawiamy,
Zespół Nautil
      `,
    };

    await transporter.sendMail(mailToAdmin);
    await transporter.sendMail(mailToUser);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Błąd wysyłki maila:", error);
    return new Response(JSON.stringify({ error: "Nie udało się wysłać wiadomości." }), {
      status: 500,
    });
  }
}
