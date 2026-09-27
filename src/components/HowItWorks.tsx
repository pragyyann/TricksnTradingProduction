"use client";

import { motion } from "framer-motion";
import { HOW_IT_WORKS_STEPS } from "@/constants";
import { useTranslations } from "next-intl";

export function HowItWorks() {
  const t = useTranslations("howItWorks");

  const getStepTitleKey = (num: number) => `step${num}_title`;
  const getStepDescKey = (num: number) => `step${num}_desc`;

  return (
    <section className="py-20 bg-[#EEE7D8] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="text-xs font-bold text-[#8B6F42] tracking-widest uppercase">
            {t("tag")}
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-[#3A3024]">
            {t("title")}
          </h2>
          <p className="text-base md:text-lg text-[#756B5D] leading-relaxed font-sans">
            {t("desc")}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative mt-8">
          {/* Connecting line (Desktop) */}
          <div className="hidden lg:block absolute top-[60px] left-[12%] right-[12%] h-0.5 bg-[#D8CCB8] -z-10" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 relative z-10">
            {HOW_IT_WORKS_STEPS.map((step, idx) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col items-center lg:items-start text-center lg:text-left bg-[#FBF9F4] lg:bg-transparent p-6 lg:p-0 rounded-2xl border border-[#D8CCB8] lg:border-0 shadow-sm lg:shadow-none"
              >
                {/* Number Circle */}
                <div className={`font-display font-extrabold text-2xl w-14 h-14 rounded-full flex items-center justify-center mb-6 shadow-md transition-all duration-300 ${
                  step.number === 1
                    ? "bg-[#D4B77A] text-[#3A3024] border-2 border-[#D4B77A]"
                    : "bg-[#FBF9F4] text-[#3A3024] border-2 border-[#D8CCB8] hover:border-[#B8955A] hover:text-[#B8955A]"
                }`}>
                  {step.number}
                </div>

                {/* Step Title */}
                <h3 className="font-display font-extrabold text-lg text-[#3A3024] mb-3">
                  {t(getStepTitleKey(step.number))}
                </h3>

                {/* Description */}
                <p className="text-sm text-[#756B5D] leading-relaxed font-sans max-w-[280px]">
                  {t(getStepDescKey(step.number))}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

