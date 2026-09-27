"use client";

import { motion } from "framer-motion";
import { HardHat, Hotel, HeartPulse, Factory, Truck, ShieldAlert, Flame, ShoppingBag } from "lucide-react";
import { INDUSTRIES } from "@/constants";
import { useTranslations } from "next-intl";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  HardHat: HardHat,
  Hotel: Hotel,
  HeartPulse: HeartPulse,
  Factory: Factory,
  Truck: Truck,
  ShieldAlert: ShieldAlert,
  Flame: Flame,
  ShoppingBag: ShoppingBag,
};

export function IndustrySection() {
  const t = useTranslations("industries");

  return (
    <section className="py-20 bg-[#F7F3EA] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="text-xs font-bold text-[#8B6F42] tracking-widest uppercase">
            {t("badge")}
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-[#3A3024]">
            {t("title")}
          </h2>
          <p className="text-base md:text-lg text-[#756B5D] leading-relaxed font-sans">
            {t("description")}
          </p>
        </div>

        {/* Industries Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {INDUSTRIES.map((industry, idx) => {
            const Icon = ICON_MAP[industry.iconName] || HardHat;
            const translationKey = industry.id === "oil-gas" ? "oilGas" : industry.id;
            return (
              <motion.div
                key={industry.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group flex flex-col items-center p-6 rounded-2xl border border-[#D8CCB8] bg-[#FBF9F4] hover:bg-[#EEE7D8] hover:border-[#B8955A] transition-all duration-300 text-center cursor-pointer shadow-sm"
              >
                {/* Circle Icon */}
                <div className="bg-[#EEE7D8] text-[#B8955A] group-hover:bg-[#D4B77A] group-hover:text-[#3A3024] transition-all duration-300 w-16 h-16 rounded-full flex items-center justify-center mb-4 border border-[#D8CCB8]">
                  <Icon className="h-6 w-6" />
                </div>
                
                {/* Industry Name */}
                <h3 className="font-display font-bold text-base md:text-lg text-[#3A3024] group-hover:text-[#B8955A] transition-colors">
                  {t(`items.${translationKey}`)}
                </h3>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
