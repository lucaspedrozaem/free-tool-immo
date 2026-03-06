"use client";

import { useId, useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  items: FAQItem[];
}

export function FAQSection({ items }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqId = useId();

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const questionId = `${faqId}-question-${i}`;
        const answerId = `${faqId}-answer-${i}`;
        const isOpen = openIndex === i;

        return (
          <div key={i} className="bg-white rounded-lg border border-border-light">
            <button
              id={questionId}
              aria-expanded={isOpen}
              aria-controls={answerId}
              className="w-full text-left px-6 py-4 flex items-center justify-between"
              onClick={() => setOpenIndex(isOpen ? null : i)}
            >
              <span className="font-semibold text-slate-dark pr-4">
                {item.question}
              </span>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isOpen && (
              <div
                id={answerId}
                role="region"
                aria-labelledby={questionId}
                className="px-6 pb-4 text-gray-600 leading-relaxed"
              >
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
