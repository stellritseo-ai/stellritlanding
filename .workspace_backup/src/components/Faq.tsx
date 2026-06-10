import { useState, useEffect, useRef } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    q: "How do dedicated sprints work compared to traditional agencies?",
    a: "Dedicated sprints align a senior-only product team exclusively to your objectives. We design, prototype, and build in rapid weekly cycles, skipping the bloated strategy phases, pitch meetings, and layers of account managers that delay progress in traditional agency setups.",
  },
  {
    q: "Who actually does the work? Will juniors learn on my dime?",
    a: "Never. We operate a strictly senior-only model. Every developer, designer, and strategist on your project has a minimum of 8 years of experience. We do not hire junior staff, ensuring that your budget goes entirely toward high-level craft and strategic execution.",
  },
  {
    q: "Can we start with a small project and scale from there?",
    a: "Yes, absolutely. We often begin with a single 2-week Sprint to tackle a critical priority, like an interactive prototype, website audit, or core branding package. This allows both teams to align on workflow before committing to a larger-scale engagement.",
  },
  {
    q: "Where is the team based?",
    a: "We are globally distributed with key hubs in Los Angeles and Lahore. This dual footprint allows us to maintain a near-24-hour cycle of productivity, passing deliverables smoothly across timezones while keeping our client managers in sync with your business hours.",
  },
  {
    q: "What technology stack do you specialize in?",
    a: "We engineer interfaces using modern, high-performance frameworks including React, Vite, Next.js, TanStack Router, Tailwind CSS, and Framer Motion. On the backend and database layer, we design serverless edge APIs and headless integrations matching the requirements of the product.",
  },
];

export default function Faq() {
  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "faq-schema-jsonld";
    script.innerHTML = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById("faq-schema-jsonld");
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <section className="relative z-10 px-6 py-28 md:px-12 lg:px-20 border-t border-white/10">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[400px_1fr] lg:gap-20">
          {/* Header Column */}
          <div>
            <span className="text-[11px] uppercase tracking-[0.5em] text-[#ff8a5b]">QUESTIONS</span>
            <h2 className="mt-4 font-serif text-[44px] leading-[1.05] tracking-tight text-white md:text-[60px]">
              Frequently asked questions.
            </h2>
            <p className="mt-6 text-[15px] leading-relaxed text-white/60">
              Can't find the answer you are looking for? Reach out to our team at{" "}
              <a href="mailto:hello@stellr.it" className="text-white underline underline-offset-4 hover:text-[#c9a4ff]">
                hello@stellr.it
              </a>{" "}
              and we'll respond within one business day.
            </p>
          </div>

          {/* Accordion Column */}
          <div className="flex flex-col justify-center">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {FAQ_ITEMS.map((item, index) => (
                <div
                  key={index}
                >
                  <AccordionItem
                    value={`item-${index}`}
                    className="border border-white/10 bg-white/[0.01] rounded-2xl px-6 transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.02] data-[state=open]:border-[#a855f7]/30 data-[state=open]:bg-[#a855f7]/[0.02]"
                  >
                    <AccordionTrigger className="text-lg text-white font-serif tracking-wide py-6 hover:no-underline hover:text-[#c9a4ff] transition-colors">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-[15px] text-white/70 leading-relaxed pb-6 pr-4">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                </div>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
