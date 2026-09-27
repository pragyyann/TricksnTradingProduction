"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

// Import Main Components
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TrustStrip } from "@/components/TrustStrip";
import { CountriesSection } from "@/components/CountriesSection";
import { ServicesSection } from "@/components/ServicesSection";
import { IndustrySection } from "@/components/IndustrySection";
import { HowItWorks } from "@/components/HowItWorks";
import { SplitCTA } from "@/components/SplitCTA";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { FAQSection } from "@/components/FAQSection";
import { LeadForm } from "@/components/LeadForm";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

// Import Loading Skeletons
import {
  HeroSkeleton,
  CountryCardsSkeleton,
  ServicesSkeleton,
  CardGridSkeleton,
  FormSkeleton
} from "@/components/ui/skeletons";

export default function Home() {
  const [isLoading, setIsLoading] = React.useState(true);

  // Simulate dynamic API data mounting delay to elegantly showcase premium skeleton overlays
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200); // 1.2 second simulated fetch latency
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Navbar />

      <main className="flex-1 w-full">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="skeletons"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full space-y-20 pb-20 pt-16"
            >
              {/* Pulsing loaders matching section heights */}
              <HeroSkeleton />
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="text-center space-y-4">
                  <div className="h-4 w-32 bg-[#D8CCB8]/50 rounded mx-auto animate-pulse" />
                  <div className="h-8 w-64 bg-[#D8CCB8]/50 rounded mx-auto animate-pulse" />
                </div>
                <CountryCardsSkeleton />
              </div>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="text-center space-y-4">
                  <div className="h-4 w-32 bg-[#D8CCB8]/50 rounded mx-auto animate-pulse" />
                  <div className="h-8 w-64 bg-[#D8CCB8]/50 rounded mx-auto animate-pulse" />
                </div>
                <ServicesSkeleton />
              </div>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="text-center space-y-4">
                  <div className="h-4 w-32 bg-[#D8CCB8]/50 rounded mx-auto animate-pulse" />
                  <div className="h-8 w-64 bg-[#D8CCB8]/50 rounded mx-auto animate-pulse" />
                </div>
                <CardGridSkeleton />
              </div>

              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <FormSkeleton />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              {/* Main Content Sections */}
              <Hero />
              <TrustStrip />
              <CountriesSection />
              <ServicesSection />
              <IndustrySection />
              <HowItWorks />
              <SplitCTA />
              <TestimonialsSection />
              <FAQSection />
              <LeadForm />
              <ContactSection />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </>
  );
}
