"use client";

import { motion } from "framer-motion";
import { Play, Quote, ArrowUpRight } from "lucide-react";
import { TESTIMONIALS, testimonialVideoUrl } from "@/data/testimonials";
import { useTranslations } from "next-intl";

export function TestimonialsSection() {
  const t = useTranslations("testimonials");

  // Duplicate items twice to ensure smooth, infinite, seamless looping marquee on wider screens
  const marqueeItems = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section id="testimonials" className="py-20 bg-[#EEE7D8] relative overflow-hidden w-full border-t border-[#D8CCB8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
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

        {/* Featured Video Testimonial Card */}
        <div className="max-w-3xl mx-auto mb-20">
          <a
            href={testimonialVideoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Watch ZOVO Gateway testimonial video on YouTube"
            className="group block bg-[#FBF9F4] rounded-[2rem] border border-[#D8CCB8] p-4 md:p-6 hover:border-[#B8955A] hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B8955A] shadow-sm"
          >
            {/* Visual Thumbnail Area */}
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-[#EEE7D8] flex items-center justify-center border border-[#D8CCB8]">
              {/* Pulsing Play Button */}
              <div className="relative z-10 w-20 h-20 rounded-full bg-[#D4B77A] hover:bg-[#B8955A] text-[#3A3024] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <span className="absolute inset-0 rounded-full bg-[#D4B77A]/30 animate-ping" />
                <Play className="h-8 w-8 fill-current ml-1" />
              </div>
              
              {/* Badge Overlay */}
              <div className="absolute bottom-4 left-4 bg-[#EEE7D8] px-3.5 py-1.5 rounded-full border border-[#B8955A] text-xs font-semibold text-[#8B6F42] flex items-center gap-1.5 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-[#B8955A] animate-pulse" />
                {t("video_label")}
              </div>
            </div>

            {/* Content Details inside Card */}
            <div className="pt-6 pb-2 px-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 max-w-xl">
                <h3 className="font-display font-extrabold text-xl text-[#3A3024] group-hover:text-[#B8955A] transition-colors">
                  {t("video_title")}
                </h3>
                <p className="text-sm text-[#756B5D] leading-relaxed font-sans">
                  {t("video_description")}
                </p>
              </div>
              <div className="shrink-0">
                <span className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-[#B8955A] bg-[#FBF9F4] text-[#3A3024] hover:bg-[#EEE7D8] font-bold text-sm shadow-sm transition-colors">
                  {t("video_cta")}
                  <ArrowUpRight className="h-4 w-4 text-[#B8955A]" />
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>

      {/* Infinite Horizontal Testimonial Marquee */}
      <div className="relative w-full overflow-hidden flex items-center py-4">
        <div className="flex animate-marquee gap-6 px-4">
          {marqueeItems.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="flex-shrink-0 w-[300px] sm:w-[350px] p-6 rounded-2xl bg-[#FBF9F4] border border-[#D8CCB8] hover:border-[#B8955A] hover:bg-[#EEE7D8] transition-all duration-300 relative flex flex-col justify-between shadow-sm"
            >
              {/* Quote Mark Decoration */}
              <div className="absolute top-4 right-4 text-[#B8955A]/30">
                <Quote className="h-8 w-8 fill-current rotate-180" />
              </div>

              {/* Testimonial Text */}
              <p className="text-sm text-[#756B5D] leading-relaxed font-sans mb-6 relative z-10 font-medium">
                "{t(item.textKey)}"
              </p>

              {/* Candidate Info with Warm Gold Indicator Accent */}
              <div className="pt-4 border-t border-[#D8CCB8] flex items-center justify-between">
                <div>
                  <h4 className="font-display font-extrabold text-sm text-[#3A3024]">
                    {t(item.nameKey)}
                  </h4>
                  <p className="text-xs text-[#9A9184] font-sans mt-0.5">
                    {t(item.roleKey)}
                  </p>
                </div>
                <div className="h-1.5 w-6 rounded-full bg-[#D4B77A]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
