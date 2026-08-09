import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronDown, ArrowRight, ArrowUpRight, Zap, Target, Layers, ShieldCheck, Cpu } from "lucide-react";
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

// Helper for dynamic icons based on index
const getBenefitIcon = (index: number) => {
  const icons = [Zap, Target, Layers, ShieldCheck, Cpu];
  return icons[index % icons.length];
};

function ServiceDynamicPage() {
  const service = Route.useLoaderData();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

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
    <main className="relative min-h-screen bg-[#0d0015] text-white selection:bg-[#ff8a5b]/30 overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      
      <ScrollBackground />
      <SiteHeader transparent />

      {/* --- HERO SECTION --- */}
      <section ref={heroRef} className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 md:px-12 lg:px-20 min-h-[90vh] flex flex-col justify-center border-b border-white/5">
        
        {/* Immersive Parallax Image Background */}
        <motion.div 
          style={{ y, scale }}
          className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity"
        >
          <img 
            src={service.heroImage} 
            alt="" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d0015] via-transparent to-[#0d0015]" />
          <div className="absolute inset-0 bg-[#0d0015]/30 backdrop-blur-[2px]" />
        </motion.div>

        {/* Dynamic Glow aligned to service color */}
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-[140px] opacity-30 pointer-events-none mix-blend-screen z-0"
          style={{ background: `radial-gradient(circle, ${service.heroColor} 0%, transparent 60%)` }}
        />
        
        <motion.div style={{ opacity, y: useTransform(scrollYProgress, [0, 1], [0, -50]) }} className="relative z-10 max-w-6xl mx-auto w-full text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8"
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: service.heroColor, boxShadow: `0 0 10px ${service.heroColor}` }} />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">Premium Service</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[48px] md:text-[80px] lg:text-[110px] leading-[0.9] tracking-tight mb-8 drop-shadow-2xl"
          >
            {service.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[20px] md:text-[28px] text-white/80 font-light max-w-4xl mx-auto leading-[1.4] drop-shadow-md mb-12"
          >
            {service.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Link to="/services" className="inline-flex items-center text-[13px] font-bold uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors group">
              <ArrowRight className="w-4 h-4 mr-2 rotate-180 group-hover:-translate-x-1 transition-transform" />
              Back to All Services
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* --- OVERLAPPING FEATURE & BENEFITS --- */}
      <section className="relative z-20 -mt-20 md:-mt-32 px-6 md:px-12 lg:px-20 pb-32">
        <div className="max-w-7xl mx-auto">
          
          {/* Main Feature Card */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-12 rounded-[32px] md:rounded-[48px] overflow-hidden bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl mb-24"
          >
            {/* Left Image */}
            <div className="lg:col-span-6 relative h-[400px] lg:h-auto overflow-hidden group">
              <img 
                src={service.featureImage} 
                alt={`${service.title} showcase`} 
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0d0015]/80 hidden lg:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0015]/80 to-transparent block lg:hidden" />
            </div>
            
            {/* Right Content */}
            <div className="lg:col-span-6 p-8 md:p-16 lg:p-20 flex flex-col justify-center relative">
              <div 
                className="absolute top-0 right-0 w-64 h-64 blur-[80px] opacity-20 pointer-events-none"
                style={{ background: service.heroColor }}
              />
              <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/50 mb-6 block">
                The Advantage
              </span>
              <p className="font-serif text-[28px] md:text-[36px] leading-[1.3] font-medium text-white/95">
                {service.description}
              </p>
            </div>
          </motion.div>

          {/* Bento Grid Benefits */}
          <div className="mb-16">
            <h2 className="font-serif text-[32px] md:text-[48px] leading-none tracking-tight mb-12 text-center">
              Why partner with StellR?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {service.benefits.map((benefit, i) => {
                const Icon = getBenefitIcon(i);
                return (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative p-8 md:p-10 rounded-3xl bg-white/5 border border-white/10 overflow-hidden hover:bg-white/10 transition-colors duration-500"
                  >
                    {/* Hover Glow */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: `radial-gradient(circle at top right, ${service.heroColor}15, transparent 60%)` }}
                    />
                    
                    <div className="relative z-10">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-white/5 border border-white/10 text-white/80 group-hover:text-white group-hover:border-white/20 transition-all duration-300 shadow-lg"
                      >
                        <Icon className="w-6 h-6" style={{ color: service.heroColor }} />
                      </div>
                      <h3 className="font-bold text-[22px] mb-4 text-white/95">{benefit.title}</h3>
                      <p className="text-[15px] leading-[1.6] text-white/60 group-hover:text-white/80 transition-colors">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* --- PROCESS / TIMELINE --- */}
      <section className="py-32 px-6 md:px-12 lg:px-20 bg-white text-[#0d0015] relative rounded-[40px] md:rounded-[80px] z-30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#0d0015]/50 mb-4 block">
              Our Methodology
            </span>
            <h2 className="font-serif text-[48px] md:text-[72px] leading-none tracking-tight">
              How we deliver.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {service.process.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="relative group p-8 rounded-[32px] bg-[#FAF5EE] border border-black/5 hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
              >
                {/* Background Number Watermark */}
                <div className="absolute -right-6 -bottom-10 text-[180px] font-serif font-bold text-black/[0.03] group-hover:text-black/[0.05] transition-colors pointer-events-none select-none leading-none">
                  {i + 1}
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <span 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-[14px]"
                      style={{ backgroundColor: service.heroColor }}
                    >
                      0{i + 1}
                    </span>
                    <div className="h-px flex-1 bg-black/10 group-hover:bg-black/20 transition-colors" />
                  </div>
                  <h3 className="font-bold text-[22px] mb-4 text-[#0d0015]">{step.title}</h3>
                  <p className="text-[15px] leading-[1.6] text-[#0d0015]/70">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PORTFOLIO / RECENT WORK --- */}
      {service.portfolioImages && service.portfolioImages.length > 0 && (
        <section className="py-32 px-6 md:px-12 lg:px-20 bg-[#0d0015] relative z-20 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 md:mb-24">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/50 mb-4 block"
              >
                Recent Work
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="font-serif text-[40px] md:text-[64px] leading-none tracking-tight text-white"
              >
                Featured Projects
              </motion.h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {service.portfolioImages.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
                  className={`group relative rounded-[32px] overflow-hidden bg-white/5 border border-white/10 ${
                    i % 3 === 0 ? "md:col-span-2 md:h-[600px]" : "md:h-[500px]"
                  } shadow-2xl hover:border-white/20 transition-colors`}
                >
                  <img
                    src={img}
                    alt={`Portfolio piece ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0015]/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 border border-white/10 rounded-[32px] pointer-events-none" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --- FAQs --- */}
      <section className="py-32 px-6 md:px-12 lg:px-20 relative bg-[#0d0015]">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="mb-16 text-center">
            <h2 className="font-serif text-[40px] md:text-[64px] leading-none tracking-tight mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-[18px] text-white/50 font-light">
              Everything you need to know about our {service.title} services.
            </p>
          </div>

          <div className="space-y-4">
            {service.faqs.map((faq, i) => (
              <div 
                key={i} 
                className="border border-white/10 rounded-2xl bg-white/5 backdrop-blur-md overflow-hidden transition-colors hover:border-white/20"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none"
                >
                  <span className="font-semibold text-[16px] md:text-[18px] pr-8 text-white/90 group-hover:text-white transition-colors">
                    {faq.q}
                  </span>
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 ${openFaq === i ? 'bg-white text-[#0d0015] border-white rotate-180' : 'border-white/20 text-white/50'}`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 md:px-8 pb-8 pt-0 text-[15px] leading-[1.8] text-white/60">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="relative py-32 px-6 md:px-12 lg:px-20 text-center overflow-hidden border-t border-white/5">
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at center, ${service.heroColor} 0%, transparent 70%)` }}
        />
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="font-serif text-[48px] md:text-[72px] leading-[1.1] tracking-tight mb-8">
            Ready to elevate your digital presence?
          </h2>
          <p className="text-[20px] text-white/60 mb-12 font-light">
            Let's discuss how our {service.title} expertise can drive measurable growth for your business.
          </p>
          <Link 
            to="/contact" 
            className="inline-flex items-center justify-center px-10 py-5 bg-white text-[#0d0015] rounded-full text-[15px] font-bold tracking-wide transition-all hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.2)] group"
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
