import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import SiteHeader from "@/components/SiteHeader";
import PageHero from "@/components/PageHero";
import ScrollBackground from "@/components/ScrollBackground";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

import uxVideo from "@/assets/video/UX.mp4";
import brandVideo from "@/assets/video/Brand.mp4";
import webProductVideo from "@/assets/video/Web-Product.mp4";
import webDevVideo from "@/assets/video/Web-Development.mp4";
import marketingVideo from "@/assets/video/Website-Management.mp4";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      {
        title:
          "Services — Custom Software Development, SaaS & Web Design | StellR IT LLC",
      },
      {
        name: "description",
        content:
          "StellR IT LLC offers custom software development, SaaS development, UX/UI design, brand identity, web development, API development, devops consulting, and digital marketing services for enterprise businesses.",
      },
      {
        name: "keywords",
        content:
          "custom software development services, saas development agency, ux research agency, brand identity design, web design company, web development services, api development, devops consulting, digital marketing agency, mvp development company, cloud migration services",
      },
      { name: "robots", content: "index, follow" },
      {
        property: "og:title",
        content:
          "Services — Custom Software Development & SaaS | StellR IT LLC",
      },
      {
        property: "og:description",
        content:
          "From UX research and brand identity to custom web apps, SaaS platforms, and digital marketing — one senior team for your entire digital stack.",
      },
      { property: "og:url", content: "https://stellrit.com/services" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://stellrit.com/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Services \u2014 Custom Software Development & SaaS | StellR IT",
      },
      {
        name: "twitter:description",
        content:
          "UX, Brand, Web Dev, SaaS, API, DevOps & Digital Marketing. One senior team.",
      },
      { name: "twitter:image", content: "https://stellrit.com/og-image.png" },
    ],
    links: [{ rel: "canonical", href: "https://stellrit.com/services" }],
  }),
  component: ServicesPage,
});

const avatar1 = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80&auto=format&fit=crop";
const avatar2 = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80&auto=format&fit=crop";

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-10">
      {items.map((item, i) => (
        <li key={i} className="flex items-start text-[14px] text-[#240945]/80 font-medium">
          <span className="mr-3 mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#ff8a5b]" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function ServicesPage() {
  return (
    <main className="relative min-h-screen selection:bg-[#ff8a5b]/30">
      <ScrollBackground />
      <SiteHeader transparent />
      
      <PageHero
        eyebrow="Services"
        title={
          <>
            One team. The <em className="font-serif italic text-[#c9a4ff]">full</em> digital stack.
          </>
        }
        description="From brand foundations to engineered platforms and the growth programs that scale them. We replace the agency-of-agencies model with one accountable senior team."
      />

      <section className="bg-[#FAF5EE] text-[#240945] py-[60px]">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-20">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-[60px] md:text-[96px] lg:text-[120px] font-bold leading-none tracking-tight mb-[60px]"
          >
            Our Perspective
          </motion.h1>

          {/* 1. UX Research */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center mb-[60px]">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#a855f7]/20 blur-[80px] rounded-full pointer-events-none" />
              <video
                src={uxVideo}
                autoPlay
                muted
                loop
                playsInline
                className="relative z-10 w-full h-auto rounded-2xl shadow-[0_20px_40px_rgba(36,9,69,0.1)] bg-white/50 border border-[#240945]/5"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#240945]/60 mb-4 block">UX Research & Strategy</span>
              <h2 className="font-serif text-[32px] md:text-[40px] font-bold leading-[1.15] mb-8">
                Strategy-led UX and UI for web, SaaS, and mobile. We engineer calm, intuitive interfaces designed to convert and retain your users.
              </h2>
              <BulletList
                items={[
                  "UX Research & Discovery",
                  "User Personas & Journeys",
                  "Information Architecture",
                  "Wireframing & Prototyping",
                  "Usability Testing",
                  "UX/UI Design Workshops",
                ]}
              />
              <Link to="/contact" className="inline-flex items-center justify-center px-8 py-3.5 bg-[#180028] text-[#FAF5EE] rounded-full text-[13px] font-semibold transition-transform hover:bg-[#240945] hover:scale-105 shadow-xl">
                View UX Research Service
              </Link>
            </motion.div>
          </div>

          {/* 2. Brand Identity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center mb-[60px]">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#240945]/60 mb-4 block">Brand Identity</span>
              <h2 className="font-serif text-[32px] md:text-[40px] font-bold leading-[1.15] mb-8">
                Crafting iconic identities that command attention. We build distinctive brand systems, naming, and messaging that feel inevitable.
              </h2>
              <BulletList
                items={[
                  "Brand Positioning",
                  "Visual Identity",
                  "Naming & Verbal Strategy",
                  "Brand Architecture",
                  "Brand Guidelines",
                  "Content Strategy",
                ]}
              />
              <Link to="/contact" className="inline-flex items-center justify-center px-8 py-3.5 bg-[#180028] text-[#FAF5EE] rounded-full text-[13px] font-semibold transition-transform hover:bg-[#240945] hover:scale-105 shadow-xl">
                View Brand Services
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative order-1 lg:order-2"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#ff8a5b]/20 blur-[80px] rounded-full pointer-events-none" />
              <video
                src={brandVideo}
                autoPlay
                muted
                loop
                playsInline
                className="relative z-10 w-full h-auto rounded-2xl shadow-[0_20px_40px_rgba(36,9,69,0.1)] bg-white/50 border border-[#240945]/5"
              />
            </motion.div>
          </div>

          {/* Testimonial 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#180028] text-white rounded-[24px] px-8 md:px-12 py-[60px] text-center relative overflow-hidden mb-[60px] shadow-2xl"
          >
            <p className="font-serif text-[24px] md:text-[32px] leading-[1.3] text-white/95 mb-12 max-w-4xl mx-auto">
              "StellR IT LLC completely transformed our digital presence. Their attention to detail and engineering speed helped us launch our new platform months ahead of schedule."
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <div className="flex items-center gap-4">
                <img src={avatar1} alt="Avatar" className="w-12 h-12 rounded-full object-cover" />
                <div className="text-left">
                  <strong className="block text-[14px] font-bold">David Chen</strong>
                  <span className="block text-[12px] text-white/60">CTO</span>
                </div>
              </div>
              <div className="hidden md:block w-px h-10 bg-white/20 mx-4" />
              <span className="font-serif italic font-bold text-[28px] text-white/90">TechNova</span>
            </div>
          </motion.div>

          {/* 3. Web & Product Design */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center mb-[60px]">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#cc7aff]/20 blur-[80px] rounded-full pointer-events-none" />
              <video
                src={webProductVideo}
                autoPlay
                muted
                loop
                playsInline
                className="relative z-10 w-full h-auto rounded-2xl shadow-[0_20px_40px_rgba(36,9,69,0.1)] bg-white/50 border border-[#240945]/5"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#240945]/60 mb-4 block">Web & Product Design</span>
              <h2 className="font-serif text-[32px] md:text-[40px] font-bold leading-[1.15] mb-8">
                From concept to conversion — we design beautifully engineered digital products and SaaS platforms that scale with your ambition.
              </h2>
              <BulletList
                items={[
                  "Web Design & Architecture",
                  "SaaS Product Design",
                  "Design Systems",
                  "Mobile Applications",
                  "Interactive Prototyping",
                ]}
              />
              <Link to="/contact" className="inline-flex items-center justify-center px-8 py-3.5 bg-[#180028] text-[#FAF5EE] rounded-full text-[13px] font-semibold transition-transform hover:bg-[#240945] hover:scale-105 shadow-xl">
                View Design Services
              </Link>
            </motion.div>
          </div>

          {/* 4. Web Development */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center mb-[60px]">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#240945]/60 mb-4 block">Web Development</span>
              <h2 className="font-serif text-[32px] md:text-[40px] font-bold leading-[1.15] mb-8">
                Full-stack delivery in modern frameworks. For us, performance and reliability are core features, not afterthoughts.
              </h2>
              <BulletList
                items={[
                  "Custom Web Platforms",
                  "Headless Commerce",
                  "CMS Architecture",
                  "Edge & APIs",
                  "DevOps & Automation",
                ]}
              />
              <Link to="/contact" className="inline-flex items-center justify-center px-8 py-3.5 bg-[#180028] text-[#FAF5EE] rounded-full text-[13px] font-semibold transition-transform hover:bg-[#240945] hover:scale-105 shadow-xl">
                View Web Services
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative order-1 lg:order-2"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#7a2adc]/20 blur-[80px] rounded-full pointer-events-none" />
              <video
                src={webDevVideo}
                autoPlay
                muted
                loop
                playsInline
                className="relative z-10 w-full h-auto rounded-2xl shadow-[0_20px_40px_rgba(36,9,69,0.1)] bg-white/50 border border-[#240945]/5"
              />
            </motion.div>
          </div>

          {/* Testimonial 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#180028] text-white rounded-[24px] px-8 md:px-12 py-[60px] text-center relative overflow-hidden mb-[60px] shadow-2xl"
          >
            <p className="font-serif text-[24px] md:text-[32px] leading-[1.3] text-white/95 mb-12 max-w-4xl mx-auto">
              "The brand identity and product design work from StellR has elevated our market positioning entirely. The team is incredibly talented and accountable."
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <div className="flex items-center gap-4">
                <img src={avatar2} alt="Avatar" className="w-12 h-12 rounded-full object-cover" />
                <div className="text-left">
                  <strong className="block text-[14px] font-bold">Sarah Jenkins</strong>
                  <span className="block text-[12px] text-white/60">CMO</span>
                </div>
              </div>
              <div className="hidden md:block w-px h-10 bg-white/20 mx-4" />
              <span className="font-serif tracking-[0.2em] uppercase font-bold text-[24px] text-white/90">NEXUS</span>
            </div>
          </motion.div>

          {/* 5. Digital Marketing & CRO */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center mb-0">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#ff8a5b]/20 blur-[80px] rounded-full pointer-events-none" />
              <video
                src={marketingVideo}
                autoPlay
                muted
                loop
                playsInline
                className="relative z-10 w-full h-auto rounded-2xl shadow-[0_20px_40px_rgba(36,9,69,0.1)] bg-white/50 border border-[#240945]/5"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#240945]/60 mb-4 block">Digital Marketing & CRO</span>
              <h2 className="font-serif text-[32px] md:text-[40px] font-bold leading-[1.15] mb-8">
                Data-driven paid and organic campaigns that unlock compounding growth across every channel that matters.
              </h2>
              <BulletList
                items={[
                  "Paid Media & Advertising",
                  "SEO & SEM Strategy",
                  "Conversion Rate Optimization",
                  "Lifecycle & Email Marketing",
                  "Advanced Analytics",
                ]}
              />
              <Link to="/contact" className="inline-flex items-center justify-center px-8 py-3.5 bg-[#180028] text-[#FAF5EE] rounded-full text-[13px] font-semibold transition-transform hover:bg-[#240945] hover:scale-105 shadow-xl">
                View Marketing Services
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-[#180028] border-t border-white/10 py-[60px]">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-20 relative">
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
          <Link to="/contact" className="inline-flex relative z-10 items-center justify-center px-10 py-5 bg-[#a855f7] text-white rounded-full text-[15px] font-bold tracking-wide transition-transform hover:scale-105 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
            Start a Project
          </Link>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </main>
  );
}
