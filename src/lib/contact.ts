/** Contact form rules and the external-provider integration point. */

export const INQUIRY_TYPES = [
  "Software development",
  "Data analysis",
  "Engineering research",
  "Technical documentation",
  "Automation or embedded systems",
  "General question",
] as const;

export type InquiryFormInput = {
  name: string;
  email: string;
  inquiry: string;
  message: string;
  /** Honeypot: real visitors leave this empty. */
  website?: string;
};

export type InquiryErrors = Partial<Record<"name" | "email" | "inquiry" | "message", string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateInquiry(input: InquiryFormInput): InquiryErrors {
  const errors: InquiryErrors = {};
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();
  if (name.length < 2) errors.name = "Please enter your name (at least 2 characters).";
  if (!EMAIL.test(email)) errors.email = "Please enter a valid email address.";
  if (!(INQUIRY_TYPES as readonly string[]).includes(input.inquiry)) errors.inquiry = "Please choose an inquiry type.";
  if (message.length < 10) errors.message = "Please write at least 10 characters.";
  if (message.length > 2000) errors.message = "Please keep your message under 2000 characters.";
  return errors;
}

/** True when the honeypot field was filled, which indicates an automated submission. */
export function isSpam(input: InquiryFormInput): boolean {
  return Boolean(input.website && input.website.trim());
}

export function buildMailto(email: string, subject: string, body = ""): string {
  const params = [`subject=${encodeURIComponent(subject)}`];
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${email}?${params.join("&")}`;
}

/**
 * Endpoint for an external form service such as Formspree. The URL is public by design, but it
 * is read from NEXT_PUBLIC_FORMSPREE_ENDPOINT so each deployment can set its own. When it is not an
 * https URL, the form is hidden and only the email fallback is shown.
 */
export const contactFormEndpoint: string = (process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT ?? "").trim();

export const isContactFormConfigured = (endpoint: string = contactFormEndpoint): boolean =>
  /^https:\/\/\S+$/.test(endpoint);
