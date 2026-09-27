"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { FAQS } from "@/data/faqs";
import { useTranslations } from "next-intl";

export function FAQSection() {
  const t = useTranslations("faq");
  const [openId, setOpenId] = React.useState<number | null>(1); // First item open by default

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 bg-[#F7F3EA] relative overflow-hidden w-full border-t border-[#D8CCB8]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="text-xs font-bold text-[#8B6F42] tracking-widest uppercase">
            {t("sectionLabel")}
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-[#3A3024]">
            {t("heading")}
          </h2>
          <p className="text-base md:text-lg text-[#756B5D] leading-relaxed font-sans">
            {t("subtitle")}
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {FAQS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "border-[#B8955A] bg-[#FBF9F4] shadow-sm"
                    : "border-[#D8CCB8] bg-[#FBF9F4] hover:border-[#B8955A]"
                }`}
              >
                {/* Accordion Trigger Header */}
                <button
                  type="button"
                  onClick={() => toggleFAQ(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                  className="w-full flex items-center justify-between px-6 py-5 text-left font-display font-extrabold text-base md:text-lg text-[#3A3024] cursor-pointer focus:outline-none focus:text-[#B8955A] transition-colors"
                >
                  <span className={isOpen ? "text-[#B8955A]" : ""}>
                    {t(item.questionKey)}
                  </span>
                  <span className={`shrink-0 ml-4 p-1.5 rounded-lg transition-colors ${
                    isOpen ? "bg-[#EEE7D8] text-[#B8955A]" : "bg-[#EEE7D8] border border-[#D8CCB8] text-[#3A3024]"
                  }`}>
                    {isOpen ? (
                      <Minus className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </span>
                </button>

                {/* Collapsible Answer Panel */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${item.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-1 text-sm md:text-base text-[#756B5D] leading-relaxed font-sans border-t border-[#D8CCB8] bg-[#FBF9F4]">
                        {t(item.answerKey)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
