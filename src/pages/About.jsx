import { useState } from "react";
import emailjs from "@emailjs/browser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function validate(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = "Name is required.";
  } else if (values.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (!values.subject.trim()) {
    errors.subject = "Subject is required.";
  }

  if (!values.message.trim()) {
    errors.message = "Message is required.";
  } else if (values.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters.";
  }

  return errors;
}

const EMPTY = { name: "", email: "", subject: "", message: "" };

function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1 text-xs font-medium text-destructive">
      {message}
    </p>
  );
}

export default function About() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validate(values);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      document.getElementById(`field-${Object.keys(newErrors)[0]}`)?.focus();
      return;
    }
    setErrors({});
    setSendError("");
    setSending(true);
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: values.name,
          from_email: values.email,
          reply_to: values.email,
          subject: values.subject,
          message: values.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setSubmitted(true);
    } catch {
      setSendError("Failed to send your message. Please try again.");
    } finally {
      setSending(false);
    }
  }

  function handleReset() {
    setValues(EMPTY);
    setErrors({});
    setSubmitted(false);
    setSendError("");
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">About PlayerVault</h1>

      <Card>
        <CardHeader>
          <CardTitle>Who we are</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-3">
          <p>
            PlayerVault is a cross-sport search platform built to help fans,
            recruiters, and analysts quickly find athlete profiles in one place.
          </p>
          <p>
            Our goal is simple: make player discovery faster, clearer, and more enjoyable
            with responsive design, clean profile views, and practical filtering tools.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Privacy & data usage</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <ul className="list-disc pl-5 space-y-1">
            <li>No account creation is required to browse or search player data</li>
            <li>Search queries are sent from your browser to third-party sports data APIs</li>
            <li>We do not sell personal data and we minimise local data storage</li>
            <li>Only essential technical data may be processed to keep the service reliable</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact us</CardTitle>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="space-y-3 text-center py-4">
              <p className="text-2xl">✅</p>
              <p className="font-semibold text-foreground">Message sent!</p>
              <p className="text-sm text-muted-foreground">
                Thanks for reaching out. We'll get back to you at <span className="text-primary">{values.email}</span>.
              </p>
              <Button variant="outline" onClick={handleReset} className="rounded-full mt-2">
                Send another message
              </Button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-4"
              aria-label="Contact form"
            >
              <p className="text-sm text-muted-foreground">
                Questions, feedback, or corrections? Fill in the form below.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Name */}
                <div className="space-y-1">
                  <Label htmlFor="field-name">Name <span aria-hidden="true" className="text-destructive">*</span></Label>
                  <Input
                    id="field-name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={values.name}
                    onChange={handleChange}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "error-name" : undefined}
                    className="rounded-full border-primary/30 bg-background/80"
                  />
                  <FieldError id="error-name" message={errors.name} />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <Label htmlFor="field-email">Email <span aria-hidden="true" className="text-destructive">*</span></Label>
                  <Input
                    id="field-email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={values.email}
                    onChange={handleChange}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "error-email" : undefined}
                    className="rounded-full border-primary/30 bg-background/80"
                  />
                  <FieldError id="error-email" message={errors.email} />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1">
                <Label htmlFor="field-subject">Subject <span aria-hidden="true" className="text-destructive">*</span></Label>
                <Input
                  id="field-subject"
                  name="subject"
                  type="text"
                  placeholder="What is this about?"
                  value={values.subject}
                  onChange={handleChange}
                  aria-invalid={!!errors.subject}
                  aria-describedby={errors.subject ? "error-subject" : undefined}
                  className="rounded-full border-primary/30 bg-background/80"
                />
                <FieldError id="error-subject" message={errors.subject} />
              </div>

              {/* Message */}
              <div className="space-y-1">
                <Label htmlFor="field-message">
                  Message <span aria-hidden="true" className="text-destructive">*</span>
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    ({values.message.trim().length}/10 min)
                  </span>
                </Label>
                <textarea
                  id="field-message"
                  name="message"
                  rows={4}
                  placeholder="Your message..."
                  value={values.message}
                  onChange={handleChange}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "error-message" : undefined}
                  className="w-full rounded-2xl border border-primary/30 bg-background/80 px-3 py-2 text-sm outline-none transition-shadow focus-visible:ring-[3px] focus-visible:ring-ring/50 placeholder:text-muted-foreground resize-none"
                />
                <FieldError id="error-message" message={errors.message} />
              </div>

              <p className="text-xs text-muted-foreground">
                <span className="text-destructive">*</span> Required fields
              </p>

              {sendError && (
                <p role="alert" className="text-xs font-medium text-destructive">
                  {sendError}
                </p>
              )}

              <Button type="submit" disabled={sending} className="rounded-full px-8">
                {sending ? "Sending…" : "Send message"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
