import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronDown, ArrowRight, CheckCircle2, ArrowUpRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import ScrollBackground from "@/components/ScrollBackground";
import { servicesData } from "@/data/services";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = servicesData.find((s) => s.slug === params.slug);
    if (!service) throw notFound();
    return service;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    return {
      meta: [
        { title: loaderData.seo.title },
        { name: "description", content: loaderData.seo.description },
        { name: "keywords", content: loaderData.seo.keywords },
        { property: "og:title", content: loaderData.seo.title },
        { property: "og:description", content: loaderData.seo.description },
        { property: "og:url", content: `https://stellrit.com/services/${loaderData.slug}` },
        { property: "og:type", content: "article" },
      ],
      links: [{ rel: "canonical", href: `https://stellrit.com/services/${loaderData.slug}` }],
    };
  },
  component: ServiceDynamicPage,
});

function ServiceDynamicPage() {
  const service = Route.useLoaderData();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Generate Schema Markup
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    provider: {
      "@type": "Organization",
      "@id": "https://stellrit.com/#organization",
      name: "StellR IT LLC",
      url: "https://stellrit.com",
    },
    url: `https://stellrit.com/services/${service.slug}`,
    areaServed: "Worldwide",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main className="relative min-h-screen bg-[#180028] text-white selection:bg-[#ff8a5b]/30 overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      
      <ScrollBackground />
      <SiteHeader transparent />

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 md:px-12 lg:px-20 min-h-[85vh] flex flex-col justify-center overflow-hidden">
        {/* Dynamic Glow */}
        <div 
          className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[120px] opacity-20 pointer-events-none mix-blend-screen"
          style={{ background: `radial-gradient(circle, ${service.heroColor} 0%, transparent 70%)` }}
        />
        
        <motion.div style={{ y, opacity }} className="relative z-10 max-w-5xl mx-auto w-full">
          <Link to="/services" className="inline-flex items-center text-[12px] font-bold uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors mb-8 group">
            <ArrowRight className="w-4 h-4 mr-2 rotate-180 group-hover:-translate-x-1 transition-transform" />
            All Services
          </Link>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[48px] md:text-[80px] lg:text-[100px] leading-[0.95] tracking-tight mb-8"
          >
            {service.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[20px] md:text-[28px] text-white/80 font-light max-w-3xl leading-[1.4]"
          >
            {service.subtitle}
          </motion.p>
        </motion.div>
      </section>

      {/* Description & Value Prop */}
      <section className="py-24 px-6 md:px-12 lg:px-20 bg-white text-[#180028] relative rounded-t-[40px] md:rounded-t-[80px] -mt-10 z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.2)]">
        <div className="max-w-4xl mx-auto">
          <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#180028]/50 mb-6 block">
            The Advantage
          </span>
          <p className="font-serif text-[28px] md:text-[40px] leading-[1.3] font-medium mb-20 text-[#180028]/90">
            {service.description}
          </p>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
            {service.benefits.map((benefit, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#180028]/5 text-[#180028] group-hover:bg-[#180028] group-hover:text-white transition-colors duration-300">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-[20px]">{benefit.title}</h3>
                </div>
                <p className="text-[15px] leading-[1.7] text-[#180028]/70">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-32 px-6 md:px-12 lg:px-20 bg-[#FAF5EE] text-[#180028]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 md:mb-24">
            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#180028]/50 mb-4 block">
              Our Methodology
            </span>
            <h2 className="font-serif text-[40px] md:text-[64px] leading-none tracking-tight">
              How we deliver.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {service.process.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative bg-white p-8 rounded-2xl shadow-sm border border-[#180028]/5 hover:shadow-xl transition-shadow duration-300"
              >
                <div 
                  className="text-[48px] font-serif font-light text-transparent bg-clip-text mb-6 opacity-80"
                  style={{ backgroundImage: `linear-gradient(135deg, ${service.heroColor}, #180028)` }}
                >
                  0{i + 1}
                </div>
                <h3 className="font-bold text-[20px] mb-4">{step.title}</h3>
                <p className="text-[14px] leading-[1.6] text-[#180028]/70">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-32 px-6 md:px-12 lg:px-20 bg-[#180028] text-white relative overflow-hidden">
        {/* Glow */}
        <div 
          className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-10 pointer-events-none mix-blend-screen"
          style={{ background: `radial-gradient(circle, ${service.heroColor} 0%, transparent 70%)` }}
        />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="mb-16 text-center">
            <h2 className="font-serif text-[40px] md:text-[56px] leading-none tracking-tight mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-[16px] text-white/60">
              Everything you need to know about our {service.title} services.
            </p>
          </div>

          <div className="space-y-4">
            {service.faqs.map((faq, i) => (
              <div key={i} className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden backdrop-blur-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-semibold text-[16px] md:text-[18px] pr-8">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-white/50 shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === i ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <p className="p-6 pt-0 text-[15px] leading-[1.7] text-white/70">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 md:px-12 lg:px-20 bg-white text-[#180028] text-center border-t border-[#180028]/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-[40px] md:text-[64px] leading-[1.1] tracking-tight mb-8">
            Ready to elevate your digital presence?
          </h2>
          <p className="text-[18px] text-[#180028]/60 mb-12">
            Let's discuss how our {service.title} expertise can drive measurable growth for your business.
          </p>
          <Link 
            to="/contact" 
            className="inline-flex items-center justify-center px-10 py-5 bg-[#180028] text-white rounded-full text-[15px] font-bold tracking-wide transition-all hover:scale-105 hover:bg-[#240945] hover:shadow-2xl group"
          >
            Start a Project
            <ArrowUpRight className="ml-2 w-5 h-5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </main>
  );
}
