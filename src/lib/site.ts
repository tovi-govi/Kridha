export const site = {
  name: "Kridha",
  tagline: "Software Solutions Pvt. Ltd.",
  whatsapp: "919989044427",
  email: "info@kridhasoftware.com",
  phoneDisplay: "9989044427 / 9989044428",
  website: "https://www.kridhasoftware.com",
  websiteDisplay: "www.kridhasoftware.com",
  originalFeeINR: 50000,
  feeINR: 34999,
  batch: "2026",
};

export const waLink = (text: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

export const gmailComposeLink = (subject = "", body = "") => {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: site.email,
  });

  if (subject) params.set("su", subject);
  if (body) params.set("body", body);

  return `https://mail.google.com/mail/?${params.toString()}`;
};

export const mailLink = (subject: string, body: string) =>
  `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
