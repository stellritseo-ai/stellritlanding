import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import {
  ChevronDown,
  ArrowRight,
  ArrowUpRight,
  Zap,
  Target,
  Layers,
  ShieldCheck,
  Cpu,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import ScrollBackground from "@/components/ScrollBackground";
import { servicesData } from "@/data/services";
import {
  SITE_URL,
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildRouteHead,
  canonicalUrl,
} from "@/lib/seo";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = servicesData.find((s) => s.slug === params.slug);
    if (!service) throw notFound();
    return service;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    return buildRouteHead({
      title: loaderData.seo.title,
      description: loaderData.seo.description,
      path: `/services/${loaderData.slug}`,
      ogType: "website",
      image: loaderData.featureImage,
      imageAlt: `${loaderData.title} — StellR IT LLC`,
    });
  },
  component: ServiceDynamicPage,
});

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

  const serviceUrl = canonicalUrl(`/services/${service.slug}`);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${serviceUrl}#service`,
    name: service.title,
    serviceType: service.serviceType,
    description: service.description,
    provider: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "StellR IT LLC",
      url: `${SITE_URL}/`,
    },
    url: serviceUrl,
    areaServed: [
      { "@type": "City", name: "Garland" },
      { "@type": "State", name: "Texas" },
      { "@type": "Country", name: "United States" },
    ],
  };

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.title, path: `/services/${service.slug}` },
  ]);

  const faqSchema = buildFaqSchema(service.faqs);

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main className="relative min-h-screen bg-[#0d0015] text-white selection:bg-[#ff8a5b]/30 overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <ScrollBackground />
      <SiteHeader transparent />

      {/* --- HERO SECTION --- */}
      <section
        ref={heroRef}
        className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 md:px-12 lg:px-20 min-h-[90vh] flex flex-col justify-center border-b border-white/5"
      >
        {/* Immersive Parallax Image Background */}
        <motion.div
          style={{ y, scale }}
          className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity"
        >
          <img
            src={service.heroImage}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d0015] via-transparent to-[#0d0015]" />
          <div className="absolute inset-0 bg-[#0d0015]/50" />
        </motion.div>

        {/* Dynamic Glow aligned to service color */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-30 pointer-events-none mix-blend-screen z-0"
          style={{ background: `radial-gradient(circle, ${service.heroColor} 0%, transparent 60%)` }}
        />

        <motion.div
          style={{ opacity, y: useTransform(scrollYProgress, [0, 1], [0, -50]) }}
          className="relative z-10 max-w-6xl mx-auto w-full text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8"
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: service.heroColor,
                boxShadow: `0 0 10px ${service.heroColor}`,
              }}
            />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">
              {service.serviceType}
            </span>
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
            <Link
              to="/services"
              className="inline-flex items-center text-[13px] font-bold uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors group"
            >
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
            className="grid grid-cols-1 lg:grid-cols-12 rounded-[32px] md:rounded-[48px] overflow-hidden bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl mb-24"
          >
            {/* Left Image */}
            <div className="lg:col-span-6 relative h-[400px] lg:h-auto overflow-hidden group">
              <img
                src={service.featureImage}
                alt={`${service.title} engineering showcase by StellR IT LLC`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0d0015]/80 hidden lg:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0015]/80 to-transparent block lg:hidden" />
            </div>

            {/* Right Content */}
            <div className="lg:col-span-6 p-8 md:p-16 lg:p-20 flex flex-col justify-center relative">
              <div
                className="absolute top-0 right-0 w-64 h-64 opacity-20 pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${service.heroColor} 0%, transparent 70%)`,
                }}
              />
              <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/50 mb-6 block">
                The Advantage
              </span>
              <p className="font-serif text-[26px] md:text-[32px] leading-[1.35] font-medium text-white/95">
                {service.description}
              </p>
            </div>
          </motion.div>

          {/* Problems Solved & Ideal Fit */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-24">
            <div className="p-8 md:p-10 rounded-3xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="w-5 h-5" style={{ color: service.heroColor }} />
                <h2 className="font-serif text-[26px] md:text-[32px] leading-tight text-white">
                  Problems We Solve
                </h2>
              </div>
              <ul className="space-y-4">
                {service.problemsSolved.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[15px] leading-[1.6] text-white/75">
                    <span
                      className="mt-2 h-1.5 w-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: service.heroColor }}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 md:p-10 rounded-3xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className="w-5 h-5" style={{ color: service.heroColor }} />
                <h2 className="font-serif text-[26px] md:text-[32px] leading-tight text-white">
                  Who Needs This Service
                </h2>
              </div>
              <ul className="space-y-4">
                {service.whoNeedsIt.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[15px] leading-[1.6] text-white/75">
                    <span
                      className="mt-2 h-1.5 w-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: service.heroColor }}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bento Grid Benefits */}
          <div className="mb-24">
            <h2 className="font-serif text-[32px] md:text-[48px] leading-none tracking-tight mb-12 text-center">
              Capabilities & Outcomes
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
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at top right, ${service.heroColor}15, transparent 60%)`,
                      }}
                    />

                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-white/5 border border-white/10 text-white/80 group-hover:text-white group-hover:border-white/20 transition-all duration-300 shadow-lg">
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

          {/* Technologies & Industries */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-8 md:p-10 rounded-3xl bg-white/5 border border-white/10">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50 block mb-3">
                Tech Stack
              </span>
              <h2 className="font-serif text-[26px] md:text-[32px] leading-tight text-white mb-6">
                Technologies & Platforms
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {service.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-white/85"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-8 md:p-10 rounded-3xl bg-white/5 border border-white/10">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50 block mb-3">
                Domain Fit
              </span>
              <h2 className="font-serif text-[26px] md:text-[32px] leading-tight text-white mb-6">
                Industry Applications
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {service.industries.map((ind) => (
                  <span
                    key={ind}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-white/85"
                  >
                    {ind}
                  </span>
                ))}
              </div>
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
                  <p className="text-[15px] leading-[1.6] text-[#0d0015]/70">{step.description}</p>
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
                    alt={
                      service.portfolioCaptions?.[i] ??
                      `${service.title} project showcase ${i + 1} by StellR IT LLC`
                    }
                    loading="lazy"
                    decoding="async"
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

      {/* --- RELATED CASE STUDIES & SERVICES (CONTEXTUAL INTERNAL LINKS) --- */}
      <section className="py-20 px-6 md:px-12 lg:px-20 bg-[#0d0015] border-t border-white/5 relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          {service.relatedCaseStudies.length > 0 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50 block mb-3">
                Proven Delivery
              </span>
              <h2 className="font-serif text-[28px] md:text-[36px] text-white mb-6">
                Related Case Studies
              </h2>
              <div className="space-y-4">
                {service.relatedCaseStudies.map((cs) => (
                  <Link
                    key={cs.slug}
                    to="/case-studies/$slug"
                    params={{ slug: cs.slug }}
                    className="group flex items-center justify-between gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/25 transition-colors"
                  >
                    <div>
                      <h3 className="font-serif text-xl text-white group-hover:text-[#c9a4ff] transition-colors">
                        {cs.title}
                      </h3>
                      <p className="text-sm text-white/60 mt-1">{cs.subtitle}</p>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-white/50 group-hover:text-white shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {service.relatedServices.length > 0 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50 block mb-3">
                Explore Further
              </span>
              <h2 className="font-serif text-[28px] md:text-[36px] text-white mb-6">
                Related Services
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.relatedServices.map((rel) => (
                  <Link
                    key={rel.slug}
                    to="/services/$slug"
                    params={{ slug: rel.slug }}
                    className="group flex items-center justify-between gap-3 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/25 transition-colors"
                  >
                    <span className="font-medium text-sm text-white/90 group-hover:text-white">
                      {rel.title}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-white/45 group-hover:text-white shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* --- FAQs (Always rendered in SSR DOM, visually toggled via CSS grid-rows) --- */}
      <section className="py-32 px-6 md:px-12 lg:px-20 relative bg-[#0d0015]">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="mb-16 text-center">
            <h2 className="font-serif text-[40px] md:text-[64px] leading-none tracking-tight mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-[18px] text-white/50 font-light">
              Direct answers about our {service.title} capabilities, timelines, and engagement process.
            </p>
          </div>

          <div className="space-y-4">
            {service.faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="border border-white/10 rounded-2xl bg-white/5 backdrop-blur-md overflow-hidden transition-colors hover:border-white/20"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`service-faq-panel-${i}`}
                    id={`service-faq-btn-${i}`}
                    className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none cursor-pointer"
                  >
                    <span className="font-semibold text-[16px] md:text-[18px] pr-8 text-white/90">
                      {faq.q}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 transition-all duration-300 ${
                        isOpen
                          ? "bg-white text-[#0d0015] border-white rotate-180"
                          : "border-white/20 text-white/50"
                      }`}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </button>
                  <div
                    id={`service-faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`service-faq-btn-${i}`}
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 md:px-8 pb-8 pt-0 text-[15px] leading-[1.8] text-white/65">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="relative py-32 px-6 md:px-12 lg:px-20 text-center overflow-hidden border-t border-white/5">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, ${service.heroColor} 0%, transparent 70%)`,
          }}
        />
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="font-serif text-[48px] md:text-[72px] leading-[1.1] tracking-tight mb-8">
            Ready to elevate your digital presence?
          </h2>
          <p className="text-[20px] text-white/60 mb-12 font-light">
            Let&apos;s discuss how our {service.title} team in Garland, TX can architect and deliver
            measurable results for your business.
          </p>
          <Link
            to="/contact"
            onClick={() =>
              trackEvent("cta_click", { cta_location: `service_${service.slug}`, cta_label: "Start a Project" })
            }
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
