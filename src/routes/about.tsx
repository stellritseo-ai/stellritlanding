import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import SiteHeader from "@/components/SiteHeader";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import ScrollBackground from "@/components/ScrollBackground";
import ChatWidget from "@/components/ChatWidget";

import p1 from "@/assets/logos/Logo.png";
import p2 from "@/assets/logos/logo-BX_kYZ7l.png";
import p3 from "@/assets/logos/logo-BqMKyS9S.png";
import p4 from "@/assets/logos/logo-BwGEonYb.png";
import p5 from "@/assets/logos/logo-DdbW9O7g.png";
import p6 from "@/assets/logos/logo-I6fgEckf.png";
import p7 from "@/assets/logos/logo-nayshands.png";
import p8 from "@/assets/logos/logo-white-DNQTDUZa.png";
import p9 from "@/assets/logos/Image-507.png";
import p10 from "@/assets/logos/cropped-logo.png";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      {
        title:
          "About StellR IT LLC — Software Development Company & Digital Agency | Garland, TX",
      },
      {
        name: "description",
        content:
          "StellR IT LLC is a senior-led custom software development company and digital agency in Garland, TX. Over a decade of building enterprise web apps, SaaS products, brand identities, and digital campaigns for global brands.",
      },
      {
        name: "keywords",
        content:
          "digital agency garland texas, software development company texas, enterprise digital agency, digital transformation company, software outsourcing company, custom web application development, ux design agency, brand identity design agency",
      },
      { name: "robots", content: "index, follow" },
      {
        property: "og:title",
        content: "About StellR IT LLC — Software Development Company & Digital Agency",
      },
      {
        property: "og:description",
        content:
          "A senior team of strategists, designers and engineers building enterprise software and unforgettable digital experiences. Based in Garland, TX.",
      },
      { property: "og:url", content: "https://stellrit.com/about" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://stellrit.com/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "About StellR IT LLC — Digital Agency & Software Development",
      },
      {
        name: "twitter:description",
        content:
          "Senior-led digital agency. Enterprise software, SaaS, brand, UX & marketing. Garland, TX.",
      },
      { name: "twitter:image", content: "https://stellrit.com/og-image.png" },
    ],
    links: [{ rel: "canonical", href: "https://stellrit.com/about" }],
  }),
  component: AboutPage,
});

const STATS = [
  { v: "12+", l: "Years" },
  { v: "180+", l: "Brands" },
  { v: "42", l: "Awards" },
];

const VALUES = [
  {
    t: "Authenticity",
    d: "We focus on real outcomes, not just shiny deliverables. True craftsmanship over fast outputs.",
  },
  {
    t: "Empathy",
    d: "Deeply understanding your users drives our every decision. We build for humans first.",
  },
  {
    t: "Curiosity",
    d: "We constantly question assumptions to find better paths and spark innovation.",
  },
  {
    t: "Collaboration",
    d: "Your domain expertise plus our digital mastery creates unbeatable products.",
  },
  {
    t: "Resilience",
    d: "Building systems designed to scale and endure over time, avoiding technical debt.",
  },
  {
    t: "Craftsmanship",
    d: "Every detail matters. We ship fewer things, better, ensuring a premium experience.",
  },
];

const TESTIMONIALS = [
  {
    text: "StellR IT delivered beyond our wildest expectations. The quality of engineering and design is unmatched.",
    name: "John Smith",
    role: "CEO, TechCorp",
    img: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&q=80&auto=format&fit=crop"
  },
  {
    text: "Their strategic insight completely shifted our product roadmap. We are now the undisputed leader in our category.",
    name: "Sarah Jenkins",
    role: "VP Marketing, FinTrust",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80&auto=format&fit=crop"
  },
  {
    text: "The team feels like an extension of our own. They brought senior-level expertise to every single conversation.",
    name: "Marcus Doe",
    role: "Founder, Bloom",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80&auto=format&fit=crop"
  }
];

function AboutPage() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://stellrit.com/#organization",
    name: "StellR IT LLC",
    url: "https://stellrit.com",
    logo: "https://stellrit.com/fav.png",
    image: "https://stellrit.com/og-image.png",
    description:
      "Senior-led custom software development company and digital agency in Garland, TX. Over a decade building enterprise web apps, SaaS products, brand identities, and digital campaigns.",
    telephone: "+12148380543",
    email: "info@stellrit.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "5305 Creek CT",
      addressLocality: "Garland",
      addressRegion: "TX",
      postalCode: "75043",
      addressCountry: "US",
    },
    foundingDate: "2012",
    numberOfEmployees: { "@type": "QuantitativeValue", value: 25 },
    areaServed: [
      { "@type": "State", name: "Texas" },
      { "@type": "Country", name: "United States" },
    ],
    sameAs: [
      "https://twitter.com/StellRIT",
      "https://www.linkedin.com/company/stellrit",
      "https://clutch.co/profile/stellr-it",
      "https://www.goodfirms.co/company/stellr-it",
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://stellrit.com" },
      { "@type": "ListItem", position: 2, name: "About", item: "https://stellrit.com/about" },
    ],
  };

  return (
    <main className="relative min-h-screen bg-[#180028] overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <ScrollBackground />
      <SiteHeader transparent />
      <PageHero
        title="We’re a digital-first, multi-disciplinary, creative agency. We give brands artistic vision that propels businesses forward."
        description="For industry leaders, fintech, e-commerce, arts & entertainment, non-profits, and education."
      />

      {/* Cream Section */}
      <section className="bg-[#FAF5EE] text-[#240945] rounded-t-[40px] md:rounded-t-[80px] -mt-10 relative z-30 pt-24 md:pt-32 pb-10">
        {/* Story Section */}
        <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-20 mb-32">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-serif text-[48px] md:text-[64px] lg:text-[80px] leading-none tracking-tight mt-[-50px] mb-[40px]"
          >
            Our Story
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-12 lg:gap-24 border-t border-[#240945]/20 pt-10">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#240945]/60">OUR HISTORY</span>
            </div>
            <div>
              <h3 className="font-serif font-bold text-[32px] md:text-[47px] leading-[1.1] tracking-tight mb-12 max-w-[900px]">
                StellR IT LLC was born out of a desire to create lasting digital experiences with exceptional usability.
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 text-[15px] md:text-[17px] leading-[1.65] text-[#240945]/75 mb-12">
                <p>
                  As a global digital studio, we've spent over a decade crafting brands, products, and campaigns for enterprise leaders. We believe that technology should serve people, and every digital touchpoint is an opportunity to forge a deeper connection with your audience.
                </p>
                <p>
                  Our senior-only team of strategists, designers, and engineers bring unmatched expertise to every project. We don't just build websites; we architect comprehensive digital ecosystems that drive measurable growth and elevate your brand's market position.
                </p>
              </div>

              <Link to="/contact" className="inline-flex items-center justify-center px-8 py-4 bg-[#240945] text-[#FAF5EE] rounded-full text-[14px] font-medium transition-transform hover:bg-[#180028] hover:scale-105">
                Join Us
              </Link>
            </div>
          </div>
        </div>

        {/* Industry Recognition */}
        <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-12 lg:gap-24 border-t border-[#240945]/10 py-[30px]">
            <div className="flex items-center">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#240945]/60">INDUSTRY RECOGNITION</span>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-12 md:gap-24">
              {STATS.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="flex items-center justify-center gap-6 relative group"
                >
                  {/* Left Laurel */}
                  <svg width="40" height="90" viewBox="0 0 40 90" fill="none" className="text-[#D4AF37] opacity-60 group-hover:opacity-100 transition-opacity">
                    <path d="M40 90C40 90 0 70 0 45C0 20 40 0 40 0C30 15 20 30 40 45C20 60 30 75 40 90Z" fill="currentColor" />
                  </svg>
                  <div className="flex flex-col items-center justify-center text-center">
                    <span className="font-serif text-[32px] md:text-[40px] text-[#240945] mb-2">{s.v}</span>
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#240945]/60">{s.l}</span>
                  </div>
                  {/* Right Laurel */}
                  <svg width="40" height="90" viewBox="0 0 40 90" fill="none" className="text-[#D4AF37] opacity-60 group-hover:opacity-100 transition-opacity" style={{ transform: 'scaleX(-1)' }}>
                    <path d="M40 90C40 90 0 70 0 45C0 20 40 0 40 0C30 15 20 30 40 45C20 60 30 75 40 90Z" fill="currentColor" />
                  </svg>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Our Core */}
        <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-12 lg:gap-24 border-t border-[#240945]/20 pt-10">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#240945]/60">OUR CORE</span>
            </div>
            <div>
              <h3 className="font-serif font-bold text-[32px] md:text-[40px] leading-[1.1] tracking-tight mb-16 max-w-[900px]">
                We believe the best work emerges from collaboration and communication. By following our curiosity, we spark innovation.
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 mb-12">
                {VALUES.map((v, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="border-t border-[#240945]/10 pt-6 relative"
                  >
                    <div className="absolute top-0 left-0 w-3 h-[2px] bg-[#E35375]" />
                    <h4 className="font-serif text-[24px] mb-3 text-[#240945]">{v.t}</h4>
                    <p className="text-[15px] leading-[1.6] text-[#240945]/70 max-w-[320px]">{v.d}</p>
                  </motion.div>
                ))}
              </div>

              <Link to="/services" className="inline-flex items-center justify-center px-8 py-4 bg-[#240945] text-[#FAF5EE] rounded-full text-[14px] font-medium transition-transform hover:bg-[#180028] hover:scale-105 mt-6 mb-[-100px]">
                View Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Colorful Wave Transition */}
      <div className="relative z-20 w-full overflow-hidden leading-none bg-[#180028] -mt-[1px]">
        <svg viewBox="0 0 1440 200" className="w-full h-[120px] md:h-[200px] block" preserveAspectRatio="none">
          <path fill="#FAF5EE" d="M0,0 L1440,0 L1440,80 C1100,160 700,20 400,80 C200,110 0,60 0,60 Z"></path>
          {/* Subtle gradient wave to blend into dark section */}
          <path d="M0,60 C200,110 700,20 1100,160 L1440,80 L1440,200 L0,200 Z" fill="url(#wave-gradient)"></path>
          <defs>
            <linearGradient id="wave-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2A0B4C" />
              <stop offset="100%" stopColor="#180028" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Dark Section Transition & Partners */}
      <section className="relative bg-[#180028] pt-16 pb-24 text-white">
        {/* Glow Effects */}
        <div className="absolute top-10 left-10 w-[600px] h-[600px] bg-gradient-to-br from-[#772588]/30 to-[#a855f7]/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-20 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif font-bold text-[50px] leading-none tracking-tight mb-16"
          >
            Partners
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-5 border-l border-t border-white/10 mb-32">
            {[p1, p2, p3, p4, p5, p6, p7, p8, p9, p10].map((imgSrc, i) => (
              <div key={i} className="flex items-center justify-center p-8 border-r border-b border-white/10 opacity-60 hover:opacity-100 transition-opacity h-[160px]">
                <img src={imgSrc} alt={`Partner ${i + 1}`} className="max-w-[120px] max-h-[60px] object-contain" style={{ filter: "brightness(0) invert(1)" }} />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-12 lg:gap-24 pt-10">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">TESTIMONIALS</span>
            </div>
            <div>
              <h3 className="font-serif text-[32px] md:text-[47px] leading-[1.1] tracking-tight mb-20 max-w-[800px]">
                We consistently create new ways to transform and strengthen your business and brand.
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
                {/* Horizontal line passing through circles */}
                <div className="absolute top-1/2 left-0 w-full h-px bg-white/10 hidden md:block -translate-y-1/2" />

                {TESTIMONIALS.map((t, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.15 }}
                    className="relative z-10 bg-[#180028] aspect-square rounded-full border border-dashed border-white/30 flex flex-col justify-center items-center p-10 text-center group hover:border-[#ff8a5b] transition-colors duration-500 overflow-hidden"
                  >
                    {/* Hover Glow inside circle */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#a855f7]/5 to-[#ff8a5b]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Quotation Mark Background */}
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[100px] font-serif text-white/5 group-hover:text-[#ff8a5b]/10 transition-colors duration-500 pointer-events-none select-none leading-none">
                      “
                    </div>

                    <p className="text-[13px] md:text-[14px] leading-[1.65] text-white/80 relative z-10 italic">"{t.text}"</p>

                    <div className="mt-8 flex flex-col items-center gap-3 relative z-10">
                      <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#180028]" />
                      <div>
                        <strong className="block text-[14px] text-white font-serif tracking-wide">{t.name}</strong>
                        <span className="text-[10px] uppercase tracking-[0.1em] text-white/50">{t.role}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-[#180028] border-t border-white/10 pt-24 pb-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-20 relative">
          {/* subtle glow for CTA */}
          <div className="absolute top-0 right-10 w-[400px] h-[400px] bg-gradient-to-tl from-[#ff8a5b]/20 to-transparent blur-[80px] rounded-full pointer-events-none" />

          <motion.h2 
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[40px] md:text-[50px] leading-[1.05] tracking-tight text-white mb-10 max-w-[1000px] relative z-10"
          >
            We look forward to hearing about your project. Let's collaborate, win new customers, and move your brand forward.
          </motion.h2>
          <Link to="/contact" className="inline-flex relative z-10 items-center justify-center px-10 py-5 bg-gradient-to-r from-[#a855f7] to-[#ff8a5b] text-white rounded-full text-[15px] font-bold tracking-wide transition-transform hover:scale-105 shadow-[0_0_30px_rgba(255,138,91,0.3)]">
            Start a Project
          </Link>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </main>
  );
}
