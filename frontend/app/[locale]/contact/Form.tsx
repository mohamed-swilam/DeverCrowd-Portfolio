"use client";

import { useState } from "react";
import { FiSend, FiCheckCircle } from "react-icons/fi";
import { motion } from "motion/react";
import { post } from "@/data/api";
import { useTranslations } from "next-intl";

interface FormState {
  name: string;
  email: string;
  phoneNumber: string;
  title: string;
  knownBy: string;
  requestedServices: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phoneNumber?: string;
  title?: string;
  knownBy?: string;
  requestedServices?: string;
  message?: string;
}

const inputClass =
  "w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 hover:border-border/80 backdrop-blur-sm";

const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground/70";

const emptyForm: FormState = {
  name: "",
  email: "",
  phoneNumber: "",
  title: "",
  knownBy: "",
  requestedServices: "",
  message: "",
};

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const t = useTranslations("Contact");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setSubmitError("");
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.email.trim()) newErrors.email = "Email is required.";
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) newErrors.email = "Invalid email format.";
    if (!form.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required.";
    else if (!/^(?:\+?\d{9,15}|0\d{8,14})$/.test(form.phoneNumber)) newErrors.phoneNumber = "Invalid phone number.";
    if (!form.title.trim()) newErrors.title = "Title is required.";
    if (!form.knownBy.trim()) newErrors.knownBy = "This field is required.";
    if (!form.requestedServices.trim()) newErrors.requestedServices = "Please select a service.";
    if (!form.message.trim() || form.message.length < 10) newErrors.message = "Message must be at least 10 characters.";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setSubmitError("");
    try {
      const res = await post("/api/contact", form);
      if (res.ok) {
        setSuccess(true);
        setForm(emptyForm);
        setErrors({});
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setSubmitError(res.message || "Something went wrong. Please try again.");
      }
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {success && (
        <motion.div
          className="mb-6 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/8 px-5 py-3.5 text-sm text-primary"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <FiCheckCircle className="text-xl shrink-0" />
          <span className="font-medium">Message sent successfully! We'll get back to you soon.</span>
        </motion.div>
      )}

      {submitError && (
        <p className="mb-4 text-sm text-destructive" role="alert">{submitError}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Row 1 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {(["name", "email"] as const).map((field) => (
            <div key={field}>
              <label className={labelClass} htmlFor={field}>
                {field === "email" ? t("form.form_fields.email") : t("form.form_fields.name")}
              </label>
              <input
                id={field}
                type={field === "email" ? "email" : "text"}
                name={field}
                value={form[field]}
                onChange={handleChange}
                placeholder={field === "email" ? "you@example.com" : "John Doe"}
                autoComplete={field === "email" ? "email" : "name"}
                className={inputClass}
              />
              {errors[field] && <p className="mt-1 text-xs text-destructive">{errors[field]}</p>}
            </div>
          ))}
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="phoneNumber">{t("form.form_fields.phone")}</label>
            <input
              id="phoneNumber"
              type="tel"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder="+20 1XX XXX XXXX"
              autoComplete="tel"
              className={inputClass}
              onKeyDown={(e) => {
                const allowed = ["Backspace", "ArrowLeft", "ArrowRight", "Tab", "Delete", "+"];
                if (!/[0-9]/.test(e.key) && !allowed.includes(e.key)) e.preventDefault();
              }}
            />
            {errors.phoneNumber && <p className="mt-1 text-xs text-destructive">{errors.phoneNumber}</p>}
          </div>
          <div>
            <label className={labelClass} htmlFor="title">{t("form.form_fields.title")}</label>
            <input
              id="title"
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="CEO, Founder, Manager…"
              className={inputClass}
            />
            {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title}</p>}
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="knownBy">{t("form.form_fields.known_by")}</label> 
            <select id="knownBy" name="knownBy" value={form.knownBy} onChange={handleChange}
              className={`${inputClass} bg-background/60`}>
              <option value="">Select an option</option>
              <option value="Social Media">Social Media</option>
              <option value="Google Search">Google Search</option>
              <option value="Friend">Friend / Referral</option>
              <option value="Event">Event</option>
              <option value="Other">Other</option>
            </select>
            {errors.knownBy && <p className="mt-1 text-xs text-destructive">{errors.knownBy}</p>}
          </div>
          <div>
            <label className={labelClass} htmlFor="requestedServices">{t("form.form_fields.requested_services")}</label>
            <select id="requestedServices" name="requestedServices" value={form.requestedServices} onChange={handleChange}
              className={`${inputClass} bg-background/60`}>
              <option value="">Select a service</option>
              <option value="Web Development">Web Development</option>
              <option value="Mobile App">Mobile App</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Other">Other</option>
            </select>
            {errors.requestedServices && <p className="mt-1 text-xs text-destructive">{errors.requestedServices}</p>}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className={labelClass} htmlFor="message">{t("form.form_fields.message")}</label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={form.message}
            onChange={handleChange}
            placeholder="Tell us about your project…"
            className={`${inputClass} resize-none`}
          />
          {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white transition-all duration-300 disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
          style={{
            background: "linear-gradient(135deg, var(--primary), var(--accent))",
            boxShadow: "0 0 24px color-mix(in srgb, var(--primary) 25%, transparent)",
          }}
          whileTap={{ scale: 0.99 }}
        >
          {loading ? (
            <span className="flex items-center gap-2 animate-pulse">Sending…</span>
          ) : (
            <>
              <span>{t("form.form_fields.submit")}</span>
              <FiSend className="text-base" />
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}