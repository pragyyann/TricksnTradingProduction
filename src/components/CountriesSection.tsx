"use client";

import { useEffect, useState, useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { fetchCountries, Country } from "@/lib/countries";
import * as Flags from "country-flag-icons/react/3x2";
import { useTranslations } from "next-intl";

export function CountriesSection() {
  const t = useTranslations("countries");
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadData() {
      const data = await fetchCountries();
      if (active) {
        setCountries(data);
        setLoading(false);
      }
    }
    loadData();
    return () => {
      active = false;
    };
  }, []);

  // Filter only active countries and sort alphabetically by country_name
  const sortedCountries = useMemo(() => {
    return countries
      .filter((c) => c.is_active === "YES")
      .sort((a, b) => a.country_name.localeCompare(b.country_name));
  }, [countries]);

  if (loading) {
    return (
      <section id="jobs-abroad" className="py-20 bg-[#F7F3EA] relative overflow-hidden w-full">
        {/* Section Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="text-xs font-bold text-[#B8955A] tracking-widest uppercase">
              {t("tag")}
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-[#3A3024]">
              {t("title")}
            </h2>
            <p className="text-base md:text-lg text-[#756B5D] leading-relaxed font-sans">
              {t("desc")}
            </p>
          </div>
        </div>

        {/* Marquee skeleton */}
        <div className="relative w-full flex items-center overflow-hidden">
          <div className="flex gap-3 sm:gap-8 py-4 px-4 mx-auto justify-center overflow-hidden w-full max-w-7xl">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="flex-shrink-0 w-[102px] sm:w-[270px] p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-[#FBF9F4] border border-[#D8CCB8] relative overflow-hidden flex flex-col items-center justify-between cursor-default"
              >
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#D8CCB8]" />
                <div className="w-12 h-8 sm:w-24 sm:h-14 rounded sm:rounded-lg bg-[#D8CCB8]/40 animate-pulse mb-2 sm:mb-4 mt-1 sm:mt-2" />
                <div className="h-4 sm:h-6 w-16 sm:w-32 bg-[#D8CCB8]/40 animate-pulse rounded mb-4 sm:mb-6 mt-0.5 sm:mt-1" />
                <div className="w-full h-8 sm:h-11 bg-[#D8CCB8]/40 animate-pulse rounded-lg sm:rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Duplicate array for seamless looping animation
  const marqueeItems = [...sortedCountries, ...sortedCountries];

  return (
    <section id="jobs-abroad" className="py-20 bg-[#F7F3EA] relative overflow-hidden w-full">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="text-xs font-bold text-[#B8955A] tracking-widest uppercase">
            {t("tag")}
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-[#3A3024]">
            {t("title")}
          </h2>
          <p className="text-base md:text-lg text-[#756B5D] leading-relaxed font-sans">
            {t("desc")}
          </p>
        </div>
      </div>

      {/* Marquee Wrapper - Full Width */}
      <div className="relative w-full flex items-center overflow-hidden">
        <div className="flex animate-marquee gap-3 sm:gap-8 py-4 px-4">
          {marqueeItems.map((country: Country, index: number) => {
            const FlagComponents = Flags as unknown as Record<string, React.ComponentType<{ className?: string; title?: string }>>;
            const FlagComponent = FlagComponents[country.country_code];

            return (
              <div
                key={`${country.country_slug}-${index}`}
                className="group flex-shrink-0 w-[102px] sm:w-[270px] p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-[#FBF9F4] border border-[#D8CCB8] hover:border-[#B8955A] hover:bg-[#EEE7D8] transition-all duration-300 relative overflow-hidden flex flex-col items-center justify-between cursor-default"
              >
                {/* Top highlight bar */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#D4B77A]" />

                {/* Flag */}
                <div className="w-12 h-8 sm:w-24 sm:h-14 rounded sm:rounded-lg overflow-hidden border border-[#D8CCB8] shadow-sm flex-shrink-0 mb-2 sm:mb-4 mt-1 sm:mt-2 transition-transform duration-300 group-hover:scale-105">
                  {FlagComponent ? (
                    <FlagComponent className="w-full h-full object-cover" title={`${country.country_name} Flag`} />
                  ) : (
                    <div className="w-full h-full bg-[#EEE7D8]" />
                  )}
                </div>

                {/* Country Name */}
                <h3 className="font-display font-extrabold text-[#3A3024] text-[11px] xs:text-xs sm:text-xl text-center tracking-tight mb-3 sm:mb-6 mt-0.5 sm:mt-1 transition-colors duration-300 group-hover:text-[#B8955A] truncate w-full px-1">
                  {country.country_name}
                </h3>

                {/* View Jobs Button */}
                <a
                  href={`/jobs/${country.country_slug}`}
                  className="w-full h-8 min-h-[32px] sm:h-11 sm:min-h-[44px] flex items-center justify-center gap-1 sm:gap-2 rounded-lg sm:rounded-xl bg-[#FBF9F4] text-[#3A3024] hover:bg-[#EEE7D8] border border-[#B8955A] font-bold text-[10px] sm:text-sm transition-all duration-300 active:scale-[0.98] shadow-sm cursor-pointer"
                >
                  <span>{t("viewJobs")}</span>
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:translate-x-1 flex-shrink-0 text-[#B8955A]" />
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* "View All Jobs" CTA Block */}
      <div className="max-w-5xl mx-auto px-4 mt-12 mb-6">
        <div className="bg-[#FBF9F4] rounded-3xl p-6 sm:p-8 border border-[#D8CCB8] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 text-center md:text-left relative z-10">
            <h3 className="text-xl sm:text-2xl font-display font-extrabold text-[#3A3024] tracking-tight">
              Not sure which country to choose?
            </h3>
            <p className="text-sm sm:text-base text-[#756B5D] leading-relaxed font-sans">
              View all active overseas job openings in one place.
            </p>
          </div>

          <div className="shrink-0 w-full md:w-auto relative z-10">
            <a
              href="/jobs"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#D4B77A] text-[#3A3024] hover:bg-[#B8955A] font-extrabold text-sm transition-all duration-300 shadow-sm cursor-pointer font-sans"
            >
              <span>View All Jobs</span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
