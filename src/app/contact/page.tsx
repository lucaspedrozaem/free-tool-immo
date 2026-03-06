"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Icon } from "@iconify/react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // mailto fallback — opens the user's email client with pre-filled fields
    const subject = encodeURIComponent(
      String(data.get("subject") || "Contact from MLSPhotoTools")
    );
    const body = encodeURIComponent(
      `Name: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`
    );
    window.location.href = `mailto:support@mlsphototools.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <section className="py-10 md:py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-midnight leading-tight text-center">
          Contact Us
        </h1>
        <p className="mt-4 text-lg text-gray-600 text-center max-w-xl mx-auto">
          Have a question, feature request, or found a bug? We&apos;d love to
          hear from you.
        </p>

        {submitted ? (
          <div className="mt-10 bg-white rounded-xl shadow-md p-8 text-center">
            <div className="w-14 h-14 mx-auto mb-4 bg-success/10 rounded-full flex items-center justify-center">
              <Icon icon="lucide:check" className="w-7 h-7 text-success" />
            </div>
            <h2 className="font-heading font-bold text-xl text-midnight">
              Your email client should have opened
            </h2>
            <p className="text-gray-600 mt-2">
              If it didn&apos;t, you can email us directly at{" "}
              <a
                href="mailto:support@mlsphototools.com"
                className="text-primary font-medium hover:underline"
              >
                support@mlsphototools.com
              </a>
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-6 text-sm text-primary font-medium hover:underline"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-10 bg-white rounded-xl shadow-md p-6 sm:p-8 space-y-5"
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
              >
                <option>General Question</option>
                <option>Feature Request</option>
                <option>Bug Report</option>
                <option>MLS Integration Help</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-y"
                placeholder="How can we help?"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-primary-end text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg hover:shadow-primary/25 transition-all duration-200"
            >
              Send Message
            </button>

            <p className="text-xs text-gray-400 text-center">
              This opens your email client. No data is sent to any server.
            </p>
          </form>
        )}

        {/* Direct email fallback */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Or email us directly at{" "}
          <a
            href="mailto:support@mlsphototools.com"
            className="text-primary font-medium hover:underline"
          >
            support@mlsphototools.com
          </a>
        </div>
      </div>
    </section>
  );
}
