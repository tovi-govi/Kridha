export const site = {
  name: "Kridha",
  tagline: "Software Solutions Pvt. Ltd.",
  whatsapp: "919989044427",
  email: "tarsieriscool@gmail.com",
  phoneDisplay: "9989044427 / 9989044428",
  website: "https://www.kridhasoftware.com",
  websiteDisplay: "www.kridhasoftware.com",
  originalFeeINR: 50000,
  feeINR: 34999,
  batch: "2026",
};

export const waLink = (text: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

export const mailLink = (subject: string, body: string) =>
  `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
