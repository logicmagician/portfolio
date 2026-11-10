"use client";

import { useId, useRef, useState } from "react";
import { INQUIRY_TYPES, isSpam, validateInquiry, type InquiryErrors } from "@/lib/contact";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Form posted to an external service (for example Formspree). It shows "sent" only when the
 * service responds with a success status. It never reports success on its own.
 */
export function ContactForm({ endpoint }: { endpoint: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const baseId = useId();
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = formRef.current;
    if (!form) return;
    const data = new FormData(form);
    const input = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      inquiry: String(data.get("inquiry") ?? ""),
      message: String(data.get("message") ?? ""),
      website: String(data.get("website") ?? ""),
    };

    const found = validateInquiry(input);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus("idle");
      return;
    }
    if (isSpam(input)) {
      setStatus("error");
      setMessage("This message could not be sent. Please use the email address instead.");
      return;
    }

    setStatus("submitting");
    setMessage("");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (response.ok) {
        setStatus("success");
        setMessage("Thank you. Your message was sent.");
        form.reset();
      } else {
        setStatus("error");
        setMessage("The message could not be sent. Please try again or use the email address.");
      }
    } catch {
      setStatus("error");
      setMessage("A network problem prevented sending. Please try again or use the email address.");
    }
  }

  const id = (name: string) => `${baseId}-${name}`;

  return (
    <form ref={formRef} className="contact-form" onSubmit={onSubmit} noValidate>
      <div className="form-field">
        <label htmlFor={id("name")}>Name</label>
        <input id={id("name")} name="name" type="text" autoComplete="name" aria-invalid={errors.name ? true : undefined} aria-describedby={errors.name ? id("name-error") : undefined} />
        {errors.name && <p className="form-error" id={id("name-error")}>{errors.name}</p>}
      </div>
      <div className="form-field">
        <label htmlFor={id("email")}>Email</label>
        <input id={id("email")} name="email" type="email" autoComplete="email" aria-invalid={errors.email ? true : undefined} aria-describedby={errors.email ? id("email-error") : undefined} />
        {errors.email && <p className="form-error" id={id("email-error")}>{errors.email}</p>}
      </div>
      <div className="form-field">
        <label htmlFor={id("inquiry")}>Inquiry type</label>
        <select id={id("inquiry")} name="inquiry" defaultValue="" aria-invalid={errors.inquiry ? true : undefined} aria-describedby={errors.inquiry ? id("inquiry-error") : undefined}>
          <option value="" disabled>Choose one</option>
          {INQUIRY_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
        {errors.inquiry && <p className="form-error" id={id("inquiry-error")}>{errors.inquiry}</p>}
      </div>
      <div className="form-field">
        <label htmlFor={id("message")}>Message</label>
        <textarea id={id("message")} name="message" rows={6} aria-invalid={errors.message ? true : undefined} aria-describedby={errors.message ? id("message-error") : undefined} />
        {errors.message && <p className="form-error" id={id("message-error")}>{errors.message}</p>}
      </div>
      {/* Honeypot: hidden from people, often filled by automated bots. */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor={id("website")}>Leave this field empty</label>
        <input id={id("website")} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <button type="submit" className="button button-primary" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Send message"}
      </button>
      <p className="form-status" role="status" aria-live="polite">{message}</p>
      <p className="form-privacy">Your message is sent to the form service configured for this site. Use the email address if you prefer.</p>
    </form>
  );
}
