"use client";

import * as React from "react";
import { useLanguage, Locale } from "@/context/LanguageContext";
import { Globe, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const LANGUAGES: { code: Locale; name: string; nativeName: string }[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी" },
  { code: "bn", name: "Bangla", nativeName: "বাংলা" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" }
];

const languageLabels = {
  en: "English · हिंदी",
  hi: "English · हिंदी",
  bn: "বাংলা",
  ta: "தமிழ்",
  ml: "മലയാളം",
};

export function LanguageSwitcher({
  isMobile = false,
  isMobileHeader = false,
  isDropdown = false
}: {
  isMobile?: boolean;
  isMobileHeader?: boolean;
  isDropdown?: boolean;
}) {
  const { locale, setLocale, sessionLocale } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocaleChange = (code: Locale) => {
    setLocale(code);
  };

  const activeLocale = sessionLocale || "en";
  const displayLabel = isMobileHeader 
    ? activeLocale.toUpperCase() 
    : (languageLabels[activeLocale] || "English · हिंदी");

  // Mode 1: Mobile drawer grid switcher (nested inside hamburger menu)
  if (isMobile) {
    return (
      <div className="w-full space-y-2">
        <label className="text-sm font-bold text-[#D4B77A] flex items-center gap-2 px-4">
          <Globe className="h-4 w-4 text-[#D4B77A]" />
          <span>Language / भाषा</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 px-4">
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === locale;
            return (
              <button
                key={lang.code}
                onClick={() => handleLocaleChange(lang.code)}
                className={cn(
                  "flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm font-medium transition-all active:scale-[0.98] cursor-pointer",
                  isSelected
                    ? "bg-[#D4B77A] text-[#3A3024] border-[#D4B77A] shadow-sm font-bold"
                    : "bg-white/5 text-[#D8CCB8] border-white/10 hover:bg-white/10 hover:text-white"
                )}
              >
                <span>{lang.nativeName}</span>
                {isSelected && <Check className="h-4 w-4 text-[#3A3024]" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Mode 2 & 3: Dropdown triggers (Desktop or Mobile Topbar Header)
  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className={cn(
          "inline-flex items-center justify-center gap-1 sm:gap-2 rounded-xl font-semibold hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4B77A] transition-all cursor-pointer shrink-0 whitespace-nowrap",
          isDropdown
            ? "border border-white/15 bg-white/5 text-[#FBF9F4] hover:bg-white/10 w-full justify-between"
            : "border border-white/15 bg-white/5 text-[#FBF9F4] hover:bg-white/10",
          isMobileHeader 
            ? "h-9 px-2 text-xs" 
            : "h-11 px-4 text-sm"
        )}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Change language / भाषा बदलें"
      >
        <Globe className={cn("text-[#D4B77A] shrink-0", isMobileHeader ? "h-3.5 w-3.5" : "h-4 w-4")} />
        <span className="font-sans tracking-wide">
          {displayLabel}
        </span>
        {!isMobileHeader && (
          <ChevronDown className={cn("h-3.5 w-3.5 text-[#D8CCB8] transition-transform duration-200 shrink-0", isOpen ? "transform rotate-180" : "")} />
        )}
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute right-0 mt-2 w-48 rounded-xl bg-[#111111] shadow-2xl border border-white/10 z-50 overflow-hidden transform origin-top-right transition-all duration-200",
            isMobileHeader ? "top-full" : ""
          )}
          role="menu"
          aria-orientation="vertical"
        >
          {/* Subtle dropdown helper */}
          <div className="bg-[#181818] px-4 py-2 border-b border-white/10 text-[10px] font-bold text-[#D4B77A] uppercase tracking-wider font-sans">
            Choose Language / भाषा चुनें
          </div>
          <div className="py-1" role="none">
            {LANGUAGES.map((lang) => {
              const isSelected = lang.code === locale;
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    handleLocaleChange(lang.code);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 text-sm transition-colors text-left font-medium cursor-pointer border-b border-white/5 last:border-b-0",
                    isSelected
                      ? "bg-white/10 text-[#D4B77A] font-semibold"
                      : "text-[#D8CCB8] hover:bg-white/5 hover:text-white"
                  )}
                  role="menuitem"
                >
                  <div className="flex flex-col">
                    <span className={cn("text-sm", isSelected ? "text-[#D4B77A] font-bold" : "text-[#FBF9F4]")}>
                      {lang.nativeName}
                    </span>
                    <span className="text-[10px] text-[#9A9184] font-normal font-sans">{lang.name}</span>
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-[#D4B77A]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
