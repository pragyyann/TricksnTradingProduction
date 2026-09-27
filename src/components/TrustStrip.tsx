"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Users, FileCheck, Compass, HeartHandshake } from "lucide-react";
import { useTranslations } from "next-intl";

export function TrustStrip() {
  const t = useTranslations("trust");

  const trustItems = [
    {
      icon: ShieldCheck,
      title: t("item1_title"),
      description: t("item1_desc")
    },
    {
      icon: Users,
      title: t("item2_title"),
      description: t("item2_desc")
    },
    {
      icon: FileCheck,
      title: t("item3_title"),
      description: t("item3_desc")
    },
    {
      icon: HeartHandshake,
      title: t("item5_title"),
      description: t("item5_desc")
    }
  ];

  return (
    <section className="bg-[#EEE7D8] py-8 text-[#756B5D] relative overflow-hidden border-y border-[#D8CCB8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
          {trustItems.map((item, idx) => {
             const Icon = item.icon;
             return (
               <motion.div
                 key={idx}
                 initial={{ opacity: 0, y: 15 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true, margin: "-50px" }}
                 transition={{ duration: 0.5, delay: idx * 0.1 }}
                 className="flex flex-col items-center justify-center p-4 md:p-6"
               >
                 <div className="bg-[#FBF9F4] border border-[#D8CCB8] text-[#B8955A] p-3 rounded-2xl mb-4">
                   <Icon className="h-6 w-6" />
                 </div>
                 <h3 className="font-display font-bold text-sm md:text-base text-[#3A3024] leading-tight">
                   {item.title}
                 </h3>
                 <p className="text-xs text-[#756B5D] mt-1 max-w-[170px] mx-auto leading-normal">
                   {item.description}
                 </p>
               </motion.div>
             );
          })}
        </div>
      </div>
    </section>
  );
}

