"use client";

import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Building2 } from "lucide-react";
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";

export function SplitCTA() {
  const t = useTranslations("split");

  const scrollToForm = (formType: "seeker" | "employer") => {
    const targetId = formType === "seeker" ? "job-seeker" : "employer";
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });

      window.location.hash = `#${targetId}`;
    }
  };

  return (
    <section id="about" className="py-20 bg-[#F7F3EA] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* For Job Seekers */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-[#FBF9F4] border border-[#D8CCB8] p-8 md:p-12 text-[#3A3024] shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="bg-[#EEE7D8] text-[#B8955A] border border-[#D8CCB8] p-3 rounded-2xl w-fit">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="font-display font-extrabold text-2xl md:text-3xl tracking-tight text-[#3A3024]">
                {t("seeker_title")}
              </h3>
              <p className="text-sm md:text-base text-[#756B5D] leading-relaxed font-sans max-w-md">
                {t("seeker_desc")}
              </p>
            </div>

            <div className="pt-8">
              <Button
                onClick={() => scrollToForm("seeker")}
                variant="primary"
                className="gap-2 cursor-pointer"
              >
                {t("seeker_btn")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          {/* For Employers */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl border border-[#D8CCB8] bg-[#FBF9F4] p-8 md:p-12 shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="bg-[#EEE7D8] text-[#B8955A] border border-[#D8CCB8] p-3 rounded-2xl w-fit">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="font-display font-extrabold text-2xl md:text-3xl tracking-tight text-[#3A3024]">
                {t("employer_title")}
              </h3>
              <p className="text-sm md:text-base text-[#756B5D] leading-relaxed font-sans max-w-md">
                {t("employer_desc")}
              </p>
            </div>

            <div className="pt-8">
              <Button
                onClick={() => scrollToForm("employer")}
                variant="secondary"
                className="gap-2 cursor-pointer"
              >
                {t("employer_btn")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

