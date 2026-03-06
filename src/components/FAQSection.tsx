"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  items: FAQItem[];
}

export function FAQSection({ items }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="bg-white rounded-lg border border-border-light">
          <button
            className="w-full text-left px-6 py-4 flex items-center justify-between"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <span className="font-semibold text-slate-dark pr-4">
              {item.question}
            </span>
            <Icon
              icon="lucide:chevron-down"
              className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${openIndex === i ? "rotate-180" : ""}`}
            />
          </button>
          {openIndex === i && (
            <div className="px-6 pb-4 text-gray-600 leading-relaxed">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
