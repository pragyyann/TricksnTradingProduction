"use client";

import { motion } from "framer-motion";
import { Briefcase, Users, CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";
import { useLanguage } from "@/context/LanguageContext";
import { getWhatsAppLink } from "./MobileStickyCTA";
import dynamic from "next/dynamic";

const HeroGlobe = dynamic(() => import("./HeroGlobe").then(mod => mod.HeroGlobe), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-square max-w-[320px] sm:max-w-[400px] lg:max-w-[500px] mx-auto flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-[#D8CCB8] border-t-[#B8955A] animate-spin" />
    </div>
  ),
});

export function Hero() {
  const t = useTranslations("hero");
  const { locale } = useLanguage();
  const whatsappUrl = getWhatsAppLink(locale);

  const scrollToForm = (formType: "seeker" | "employer") => {
    const targetId = formType === "seeker" ? "job-seeker" : "employer";
    const element = document.getElementById(targetId);
    if (element) {
      const offset = window.innerWidth >= 1024 ? 120 : 80;
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
    <section
      id="home"
      className="relative bg-[#F7F3EA] pt-[150px] pb-24 md:pt-[160px] md:pb-24 lg:pt-[170px] lg:pb-24 overflow-visible"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 w-full relative z-10">
        
        {/* Left Side: Existing Hero Content Card */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full bg-[#FBF9F4] border border-[#D8CCB8] rounded-[1.5rem] xs:rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 lg:p-10 space-y-6 shadow-sm"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-[#EEE7D8] border border-[#B8955A] px-3 py-1 rounded-full w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8955A] animate-pulse" />
            <span className="text-[10px] sm:text-xs font-bold text-[#8B6F42] uppercase tracking-wider">
              {t("badge")}
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-[2.6rem] font-display font-extrabold text-[#3A3024] leading-tight tracking-tight">
            {t("title")}
          </h1>

          {/* Subheading */}
          <p className="text-sm xs:text-base text-[#756B5D] leading-relaxed font-sans">
            {locale === "en" 
              ? "Connecting skilled Indian manpower with certified employers across Europe, GCC, and Canada through safe, legal, and transparent recruitment."
              : t("subtitle")}
          </p>

          {/* Trust Points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2 border-t border-[#D8CCB8]">
            <div className="flex items-center gap-2.5 text-[#3A3024]">
              <CheckCircle2 className="h-4.5 w-4.5 text-[#B8955A] shrink-0" />
              <span className="text-xs sm:text-sm font-medium">
                {locale === "ml" ? "100% അംഗീകൃത തൊഴിൽദാതാക്കൾ" : "100% Verified Employers"}
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-[#3A3024]">
              <CheckCircle2 className="h-4.5 w-4.5 text-[#B8955A] shrink-0" />
              <span className="text-xs sm:text-sm font-medium">
                {locale === "ml" ? "പൂർണ്ണ എമിഗ്രേഷൻ പിന്തുണ" : "Complete Emigration Support"}
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-[#3A3024]">
              <CheckCircle2 className="h-4.5 w-4.5 text-[#B8955A] shrink-0" />
              <span className="text-xs sm:text-sm font-medium">
                {locale === "ml" ? "വിദഗ്ദ്ധരായ വ്യാവസായിക വിദഗ്ദ്ധർ" : "Skilled & Industrial Experts"}
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-[#3A3024]">
              <CheckCircle2 className="h-4.5 w-4.5 text-[#B8955A] shrink-0" />
              <span className="text-xs sm:text-sm font-medium">
                {locale === "ml" ? "ദ്രുതഗതിയിലുള്ള നിയമനം" : "Rapid Talent Deployment"}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 w-full">
            <Button
              onClick={() => scrollToForm("seeker")}
              variant="primary"
              size="lg"
              className="w-full sm:w-auto justify-center gap-2.5 cursor-pointer whitespace-nowrap transition-all duration-300 py-3 sm:py-4 text-sm sm:text-base font-bold bg-[#D4B77A] text-[#3A3024] hover:bg-[#B8955A]"
            >
              <Briefcase className="h-5 w-5 shrink-0 text-[#3A3024]" />
              {t("applyBtn")}
            </Button>
            <Button
              onClick={() => scrollToForm("employer")}
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto justify-center gap-2.5 transition-all duration-300 cursor-pointer whitespace-nowrap py-3 sm:py-4 text-sm sm:text-base font-bold bg-[#EEE7D8] border border-[#B8955A] text-[#3A3024] hover:bg-[#FBF9F4]"
            >
              <Users className="h-5 w-5 shrink-0 text-[#B8955A]" />
              {t("hireBtn")}
            </Button>
          </div>
        </motion.div>

        {/* Right Side: Contained Visual Area with Animated Globe */}
        <div className="flex w-full items-center justify-center lg:justify-end">
          <HeroGlobe />
        </div>

      </div>

      {/* Floating Interactive WhatsApp Button (Bottom Right) */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center justify-center bg-[#10B981] hover:bg-[#059669] text-white rounded-full shadow-2xl hover:scale-105 transition-all duration-300 font-semibold group focus:outline-none focus:ring-4 focus:ring-emerald-200 w-12 h-12 sm:w-auto sm:h-auto sm:px-5 sm:py-3 shrink-0"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="h-6 w-6 shrink-0 fill-current animate-pulse" />
        <span className="hidden sm:inline text-sm">{t("whatsappBtn")}</span>
      </a>
    </section>
  );
}
