"use client";

import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { CONTACT_INFO, SERVICES } from "@/constants";
import { useTranslations } from "next-intl";
import Image from "next/image";

export function Footer() {
  const tNavbar = useTranslations("navbar");
  const tServices = useTranslations("services");
  const tFooter = useTranslations("footer");
  const tContact = useTranslations("contact");

  const getServiceTitleKey = (id: string) => {
    return `title_${id.replace(/-/g, "_")}`;
  };

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId.substring(1));
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
    }
  };

  const handleApplyNow = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById("job-seeker");
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
      
      window.location.hash = "#job-seeker";
    }
  };

  return (
    <footer className="bg-[#E6DDCD] text-[#756B5D] pt-16 pb-16 sm:pb-8 border-t border-[#D0C2AD] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-[#D0C2AD]">
          
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-6">
            <a href="#home" onClick={(e) => handleScrollTo(e, "#home")} className="flex items-center group focus:outline-none">
              <Image
                src="/zovo-gateway-logo-transparent.png"
                alt="ZOVO Gateway Logo"
                width={180}
                height={65}
                className="h-12 md:h-14 w-auto object-contain group-hover:scale-102 transition-transform duration-200"
              />
            </a>
            <p className="text-sm text-[#756B5D] font-sans leading-relaxed max-w-sm">
              An overseas manpower recruitment consultancy helping businesses hire global talent and guiding job seekers to secure visa placements globally.
            </p>
            <div className="text-xs text-[#756B5D] font-medium font-sans">
              Licence No: B-1209/MUM/COM/1000+/5/9876/2026
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-2 space-y-5">
            <h4 className="font-display font-extrabold text-sm text-[#3A3024] uppercase tracking-wider">{tFooter("quickLinks")}</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#home" onClick={(e) => handleScrollTo(e, "#home")} className="text-[#756B5D] hover:text-[#B8955A] transition-colors focus:outline-none">
                  {tNavbar("home")}
                </a>
              </li>
              <li>
                <a href="#jobs-abroad" onClick={(e) => handleScrollTo(e, "#jobs-abroad")} className="text-[#756B5D] hover:text-[#B8955A] transition-colors focus:outline-none">
                  {tNavbar("jobs")}
                </a>
              </li>
              <li>
                <a href="#services" onClick={(e) => handleScrollTo(e, "#services")} className="text-[#756B5D] hover:text-[#B8955A] transition-colors focus:outline-none">
                  {tNavbar("services")}
                </a>
              </li>
              <li>
                <a href="#about" onClick={(e) => handleScrollTo(e, "#about")} className="text-[#756B5D] hover:text-[#B8955A] transition-colors focus:outline-none">
                  {tNavbar("about")}
                </a>
              </li>
              <li>
                <a href="#contact" onClick={(e) => handleScrollTo(e, "#contact")} className="text-[#756B5D] hover:text-[#B8955A] transition-colors focus:outline-none">
                  {tNavbar("contact")}
                </a>
              </li>
              <li>
                <a href="#job-seeker" onClick={handleApplyNow} className="text-[#B8955A] hover:text-[#8B6F42] font-semibold transition-colors focus:outline-none inline-flex items-center gap-0.5">
                  {tNavbar("applyNow")} <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="/appointment" className="text-[#756B5D] hover:text-[#B8955A] transition-colors focus:outline-none">
                  {tNavbar("bookAppointment") || "Book Appointment"}
                </a>
              </li>
              <li>
                <a href="/pay" className="text-[#756B5D] hover:text-[#B8955A] transition-colors focus:outline-none">
                  {tNavbar("completePayment") || "Complete Payment"}
                </a>
              </li>
            </ul>
          </div>

          {/* Services Column */}
          <div className="lg:col-span-3 space-y-5">
            <h4 className="font-display font-extrabold text-sm text-[#3A3024] uppercase tracking-wider">{tNavbar("services")}</h4>
            <ul className="space-y-3 text-sm">
              {SERVICES.filter(s => s.active !== false).map((s) => (
                <li key={s.id}>
                  <a href="#services" onClick={(e) => handleScrollTo(e, "#services")} className="text-[#756B5D] hover:text-[#B8955A] transition-colors">
                    {tServices(getServiceTitleKey(s.id))}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact details Col */}
          <div className="lg:col-span-3 space-y-5">
            <h4 className="font-display font-extrabold text-sm text-[#3A3024] uppercase tracking-wider">{tContact("tag")}</h4>
            <ul className="space-y-3.5 text-sm font-sans">
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-[#B8955A] shrink-0 mt-1" />
                <a href={`tel:${CONTACT_INFO.phoneRaw}`} className="text-[#756B5D] hover:text-[#B8955A] transition-colors">
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-[#B8955A] shrink-0 mt-1" />
                <a href={`mailto:${CONTACT_INFO.email}`} className="text-[#756B5D] hover:text-[#B8955A] transition-colors">
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li className="flex items-start gap-3 leading-relaxed">
                <MapPin className="h-4 w-4 text-[#B8955A] shrink-0 mt-1" />
                <span className="whitespace-pre-line text-[#756B5D]">{CONTACT_INFO.address}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits / Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 text-xs text-[#756B5D] font-sans gap-4">
          <div>
            © {new Date().getFullYear()} ZOVO Gateway. {tFooter("rights")}
          </div>
          <div className="flex gap-6">
            <a href="#job-seeker" onClick={handleApplyNow} className="text-[#756B5D] hover:text-[#B8955A] transition-colors">Terms of Service</a>
            <a href="#job-seeker" onClick={handleApplyNow} className="text-[#756B5D] hover:text-[#B8955A] transition-colors">Privacy Policy</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
