import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { submitWebsiteEmailFn } from "@/lib/dashboard.functions.server";
import { motion, useScroll, useTransform } from "framer-motion";
import { toast } from "sonner";
import { Mail, Phone, MapPin, ArrowUpRight, Paperclip, UploadCloud } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import ScrollBackground from "@/components/ScrollBackground";
import ChatWidget from "@/components/ChatWidget";

// Importing all logos for the Marquee
import logo1 from "@/assets/logos/logo-BX_kYZ7l.png";
import logo2 from "@/assets/logos/logo-BqMKyS9S.png";
import logo3 from "@/assets/logos/logo-BwGEonYb.png";
import logo4 from "@/assets/logos/logo-DdbW9O7g.png";
import logo5 from "@/assets/logos/cropped-logo.png";
import logo6 from "@/assets/logos/logo-CMAon1t6 (1).png";
import logo7 from "@/assets/logos/Image-507.png";
import logo8 from "@/assets/logos/Logo.png";
import logo9 from "@/assets/logos/logo (1).png";
import logo10 from "@/assets/logos/logo-I6fgEckf.png";
import logo11 from "@/assets/logos/logo-nayshands.png";
import logo12 from "@/assets/logos/logo-white-DNQTDUZa.png";
export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      {
        title:
          "Contact StellR IT LLC — Hire AI & Software Developers | Free Consultation",
      },
      {
        name: "description",
        content:
          "Start your AI or software project with StellR IT LLC. Get a free consultation — we respond within 24 hours. Hire dedicated AI engineers, software developers, and remote engineering teams. Based in Garland, TX, serving clients worldwide.",
      },
      {
        name: "keywords",
        content:
          "contact StellR IT LLC, hire AI developers, hire software developers, hire dedicated engineering team, get AI development quote, free software development consultation, hire remote developers, software development quote, AI development company contact, custom software development inquiry, dedicated team inquiry, IT outsourcing contact, web development company contact, mobile app development quote",
      },
      { name: "robots", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
      {
        property: "og:title",
        content:
          "Contact StellR IT LLC — Hire AI & Software Developers Today",
      },
      {
        property: "og:description",
        content:
          "Free consultation. We build AI software, SaaS, web & mobile apps. Hire dedicated remote engineers. Response within 24 hours. Garland, TX — serving worldwide.",
      },
      { property: "og:url", content: "https://stellrit.com/contact" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://stellrit.com/og-image.png" },
      { property: "og:image:alt", content: "Contact StellR IT LLC — Hire AI & Software Developers" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Contact StellR IT LLC — Hire AI & Software Developers",
      },
      {
        name: "twitter:description",
        content:
          "Free consultation. AI, software, SaaS & mobile development. Hire dedicated remote teams. Response within 24 hours.",
      },
      { name: "twitter:image", content: "https://stellrit.com/og-image.png" },
    ],
    links: [{ rel: "canonical", href: "https://stellrit.com/contact" }],
  }),
  component: ContactPage,
});

const BUDGETS = ["< $1K", "$2k – $10k", "$10k – $20k", "$20+"];

const SERVICES = [
  "UX Research & Strategy",
  "Brand Identity",
  "Web & Product Design",
  "Web Development",
  "Digital Marketing"
];

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", budget: BUDGETS[1], service: SERVICES[0], message: "" });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [numA, setNumA] = useState(0);
  const [numB, setNumB] = useState(0);
  const [userCaptchaInput, setUserCaptchaInput] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    setNumA(a);
    setNumB(b);
    setUserCaptchaInput("");
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const { scrollY } = useScroll();
  // Parallax background blobs that shift/glow on scroll
  const blobY1 = useTransform(scrollY, [0, 800], [0, -100]);
  const blobScale1 = useTransform(scrollY, [0, 800], [1, 1.3]);
  const blobOpacity1 = useTransform(scrollY, [0, 800], [0.15, 0.4]);

  const blobY2 = useTransform(scrollY, [0, 1000], [0, 150]);
  const blobScale2 = useTransform(scrollY, [0, 1000], [1, 0.75]);
  const blobOpacity2 = useTransform(scrollY, [0, 1000], [0.2, 0.5]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) {
      // Ignore bot submission silently
      return;
    }
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in name, email and a short message.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (Number(userCaptchaInput.trim()) !== (numA + numB)) {
      toast.error("Incorrect security verification answer. Please try again.");
      generateCaptcha();
      return;
    }
    setLoading(true);
    try {
      await submitWebsiteEmailFn({
        data: {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          company: form.company.trim(),
          service: form.service,
          budget: form.budget,
          message: form.message.trim(),
          type: "contact",
        },
      });
      // Push generate_lead event to GTM dataLayer on successful form submission
      if (typeof window !== "undefined") {
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          event: "generate_lead",
          lead_type: "contact_form",
          service_requested: form.service,
          budget_selected: form.budget,
        });
      }
      setForm({ name: "", email: "", phone: "", company: "", budget: BUDGETS[1], service: SERVICES[0], message: "" });
      setFile(null);
      generateCaptcha();
      toast.success("Thanks — we'll be in touch within one business day.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  // test
  return (
    <main className="relative min-h-screen selection:bg-[#a855f7]/30">
      <ScrollBackground />
      <SiteHeader transparent />

      <PageHero
        eyebrow="Contact"
        title={
          <>
            Let's start <em className="font-serif italic text-[#c9a4ff]">something</em> great.
          </>
        }
        description="Tell us about your project — timeline, budget range, the problem you're solving. A senior partner replies within one business day."
      />

      {/* Main Content Area in Premium Glassmorphism */}
      <section className="bg-gradient-to-b from-[#180028] via-[#180028]/85 to-transparent text-white pt-24 pb-32 relative z-10">
        {/* Subtle grid lines background overlay - replaced heavy mask-image with a simple gradient fade to save GPU */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,transparent_40%,#180028_100%)] pointer-events-none z-0" />

        {/* Scroll-Reactive Glowing Blobs (Parallax) - using radial gradients instead of heavy blur filters */}
        <motion.div
          style={{ 
            y: blobY1, 
            scale: blobScale1, 
            opacity: blobOpacity1,
            background: "radial-gradient(circle, rgba(168,85,247,0.8) 0%, rgba(255,138,91,0.3) 45%, transparent 70%)"
          }}
          className="absolute top-[10%] left-[-15%] w-[500px] h-[500px] rounded-full pointer-events-none z-0"
        />
        <motion.div
          style={{ 
            y: blobY2, 
            scale: blobScale2, 
            opacity: blobOpacity2,
            background: "radial-gradient(circle, rgba(122,42,220,0.8) 0%, rgba(201,164,255,0.3) 45%, transparent 70%)"
          }}
          className="absolute bottom-[20%] right-[-15%] w-[600px] h-[600px] rounded-full pointer-events-none z-0"
        />

        <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-20 grid grid-cols-1 gap-16 lg:grid-cols-[4fr_6fr] relative z-10">

          {/* Left Sidebar */}
          <aside className="pr-0 lg:pr-8 relative h-full">
            <div className="space-y-12 lg:sticky lg:top-32">
              <div>
                <h3 className="font-serif text-[36px] md:text-[48px] font-bold leading-[1.05] mb-6 tracking-tight text-white text-glow">
                  Let's build something <em className="italic font-light text-[#c9a4ff]">extraordinary.</em>
                </h3>
                <p className="text-[16px] leading-[1.6] text-white/70 max-w-[95%]">
                  From pixel-perfect platform engineering to scaling digital growth, StellR IT acts as your dedicated product and marketing arm. Let's discuss your vision.
                </p>
              </div>

              <div className="space-y-8 p-8 md:p-10 glass rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 relative overflow-hidden backdrop-blur-md bg-white/5">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[radial-gradient(circle,rgba(168,85,247,0.1)_0%,transparent_70%)] rounded-full pointer-events-none" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-10">
                  <ContactBlock icon={<Mail className="h-4 w-4" />} title="Email">
                    <a href="mailto:info@stellrit.com" className="font-medium hover:text-[#ff8a5b] transition-colors duration-300">info@stellrit.com</a>
                  </ContactBlock>
                  <ContactBlock icon={<Phone className="h-4 w-4" />} title="Direct">
                    <a href="tel:2148380543" className="font-medium hover:text-[#ff8a5b] transition-colors duration-300">(214) 838-0543</a>
                  </ContactBlock>
                  <ContactBlock icon={<Phone className="h-4 w-4" />} title="Toll Free">
                    <a href="tel:3254808108" className="font-medium hover:text-[#ff8a5b] transition-colors duration-300">(325) 480-8108</a>
                  </ContactBlock>
                  <ContactBlock icon={<MapPin className="h-4 w-4" />} title="Office">
                    <span className="font-medium text-[14px] text-white/90">5305 Creek CT<br />Garland, TX 75043</span>
                  </ContactBlock>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Form Card */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            onSubmit={submit}
            className="glass rounded-[32px] p-8 md:p-14 shadow-[0_30px_100px_rgba(0,0,0,0.5)] border border-white/10 relative overflow-hidden backdrop-blur-md bg-white/5"
          >
            {/* Subtle decorative glow in top right */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-[radial-gradient(circle,rgba(168,85,247,0.25)_0%,transparent_70%)] rounded-full pointer-events-none" />

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 relative z-10">
              <Field label="Your name">
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputCls}
                  placeholder="Jane Doe"
                />
              </Field>
              <Field label="Work email">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputCls}
                  placeholder="jane@company.com"
                />
              </Field>
              <Field label="Phone number">
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={inputCls}
                  placeholder="+1 (555) 000-0000"
                />
              </Field>
              <Field label="Company">
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className={inputCls}
                  placeholder="Acme Inc."
                />
              </Field>
              <Field label="Select Service" className="md:col-span-2">
                <div className="relative">
                  <select
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                    className={inputCls + " appearance-none cursor-pointer"}
                  >
                    {SERVICES.map((s) => (
                      <option key={s} value={s} className="bg-[#180028] text-white">
                        {s}
                      </option>
                    ))}
                  </select>
                  {/* Custom dropdown arrow */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </Field>
            </div>

            <Field label="Your budget" className="mt-8 relative z-10">
              <div className="flex flex-wrap gap-3">
                {BUDGETS.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setForm({ ...form, budget: b })}
                    className={`rounded-full border px-5 py-2.5 text-[13px] font-bold tracking-wide transition-all duration-300 ${form.budget === b
                      ? "border-[#a855f7] bg-[#a855f7] text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] cursor-pointer"
                      : "border-white/10 bg-white/5 text-white/60 hover:border-[#a855f7]/50 hover:bg-white/10 hover:text-white cursor-pointer"
                      }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Tell us about your project" className="mt-8 relative z-10">
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={5}
                className={inputCls + " resize-none py-4"}
                placeholder="Goals, timeline, what success looks like…"
              />
            </Field>

            <Field label="Upload Image or Document (Optional)" className="mt-8 relative z-10">
              <div className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-xl bg-white/5 hover:bg-white/10 hover:border-[#a855f7]/50 transition-all duration-300 cursor-pointer group">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  accept="image/*,.pdf,.doc,.docx"
                />
                {file ? (
                  <div className="text-center px-4 relative z-0">
                    <Paperclip className="w-6 h-6 text-[#c9a4ff] mx-auto mb-2 text-glow" />
                    <p className="text-[14px] font-bold text-[#c9a4ff] mb-1 truncate max-w-xs md:max-w-sm">{file.name}</p>
                    <p className="text-[11px] text-white/40 uppercase tracking-[0.2em] font-medium">Click to change file</p>
                  </div>
                ) : (
                  <div className="text-center px-4 relative z-0">
                    <UploadCloud className="w-6 h-6 text-white/30 mx-auto mb-2 group-hover:text-[#c9a4ff] transition-colors" />
                    <p className="text-[13px] font-bold text-white/70">Drag and drop, or click to browse</p>
                    <p className="text-[11px] text-white/40 mt-1">PDF, DOC, JPG, PNG up to 10MB</p>
                  </div>
                )}
              </div>
            </Field>

            {/* Honeypot field (hidden from human users) */}
            <div className="hidden" aria-hidden="true">
              <input
                type="text"
                name="website_url_field"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {/* CAPTCHA Validation Widget */}
            <div className="mt-8 relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <Field label="Security Verification *">
                <div className="flex items-center gap-3">
                  {/* Styled Captcha Display */}
                  <div className="h-14 flex-1 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden select-none font-mono text-lg tracking-wider font-extrabold text-[#c9a4ff] shadow-inner">
                    {/* Background noise patterns */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#a855f7_10px,#a855f7_11px)]" />

                    {/* Math question */}
                    <span className="relative z-10 select-none text-glow drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
                      {numA} + {numB} = ?
                    </span>
                  </div>

                  {/* Refresh button */}
                  <button
                    type="button"
                    onClick={generateCaptcha}
                    className="h-14 w-14 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition active:scale-95 shadow-md cursor-pointer"
                    title="Generate new math question"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8.89M9 17H5v-4" />
                    </svg>
                  </button>
                </div>
              </Field>

              <Field label="Answer *">
                <input
                  type="number"
                  required
                  value={userCaptchaInput}
                  onChange={(e) => setUserCaptchaInput(e.target.value)}
                  className={inputCls}
                  placeholder="What is the sum?"
                  autoComplete="off"
                />
              </Field>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group mt-10 inline-flex items-center gap-4 rounded-full bg-gradient-to-r from-[#7a2adc] to-[#ff8a5b] px-8 py-4 text-[15px] font-bold tracking-wide text-white transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-70 disabled:hover:scale-100 relative z-10 shadow-[0_8px_30px_rgba(122,42,220,0.3)] cursor-pointer"
            >
              {loading ? "Sending securely…" : "Send message"}
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white/20 text-white transition-transform group-hover:rotate-45 group-hover:bg-[#a855f7] shadow-sm">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </button>
          </motion.form>
        </div>

        {/* What Happens Next - 3 Cards Row */}
        <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-20 mt-24 md:mt-32 animate-fade-in">
          <h4 className="text-center text-[12px] font-bold uppercase tracking-[0.25em] text-white/40 mb-12">
            What happens next?
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="glass p-8 rounded-[24px] bg-white/5 border border-white/10 relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-[#a855f7]/40 shadow-lg group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(circle,rgba(168,85,247,0.15)_0%,transparent_70%)] rounded-full pointer-events-none" />
              <div className="w-12 h-12 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-[#c9a4ff] text-[18px] font-extrabold mb-6 shadow-[0_0_15px_rgba(168,85,247,0.25)] group-hover:bg-[#a855f7] group-hover:text-white transition-all duration-300">
                1
              </div>
              <h5 className="text-[18px] font-bold text-white mb-3">Project Review</h5>
              <p className="text-[14px] text-white/60 leading-[1.6]">
                A senior partner reviews your requirements and responds within 1 business day.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass p-8 rounded-[24px] bg-white/5 border border-white/10 relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-[#a855f7]/40 shadow-lg group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(circle,rgba(168,85,247,0.15)_0%,transparent_70%)] rounded-full pointer-events-none" />
              <div className="w-12 h-12 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-[#c9a4ff] text-[18px] font-extrabold mb-6 shadow-[0_0_15px_rgba(168,85,247,0.25)] group-hover:bg-[#a855f7] group-hover:text-white transition-all duration-300">
                2
              </div>
              <h5 className="text-[18px] font-bold text-white mb-3">Discovery Call</h5>
              <p className="text-[14px] text-white/60 leading-[1.6]">
                We schedule a 30-minute session to align on your vision, budget, and timeline.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass p-8 rounded-[24px] bg-white/5 border border-white/10 relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-[#a855f7]/40 shadow-lg group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(circle,rgba(168,85,247,0.15)_0%,transparent_70%)] rounded-full pointer-events-none" />
              <div className="w-12 h-12 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-[#c9a4ff] text-[18px] font-extrabold mb-6 shadow-[0_0_15px_rgba(168,85,247,0.25)] group-hover:bg-[#a855f7] group-hover:text-white transition-all duration-300">
                3
              </div>
              <h5 className="text-[18px] font-bold text-white mb-3">Custom Proposal</h5>
              <p className="text-[14px] text-white/60 leading-[1.6]">
                You receive a comprehensive execution strategy and pixel-perfect design concepts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust / Scrolling Logos Section */}
      <section className="bg-transparent pb-24 relative z-10">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-20 mb-8 border-t border-white/10 pt-16">
          <p className="text-center text-[12px] font-medium uppercase tracking-[0.25em] text-white/40 mb-10">
            Trusted by innovative companies worldwide
          </p>
        </div>
        <div className="relative overflow-hidden w-full max-w-[1600px] mx-auto">
          {/* Subtle gradient fades on edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0d0220] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0d0220] to-transparent z-10 pointer-events-none" />

          <div className="flex w-max" style={{ animation: "marquee-contact 45s linear infinite", willChange: "transform" }}>
            {/* Repeat the logos array twice to create a seamless infinite loop */}
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center">
                {[logo1, logo2, logo3, logo4, logo5, logo6, logo7, logo8, logo9, logo10, logo11, logo12].map((logo, idx) => (
                  <img
                    key={idx}
                    src={logo}
                    alt="Partner Logo"
                    className="mx-10 md:mx-16 h-12 md:h-14 w-auto object-contain opacity-35 hover:opacity-100 transition-all duration-500"
                    style={{ filter: "brightness(0) invert(1)" }}
                  />
                ))}
              </div>
            ))}
          </div>
          <style>{`
            @keyframes marquee-contact {
              from { transform: translateX(0); }
              to { transform: translateX(-50%); }
            }
          `}</style>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </main>
  );
}

const inputCls =
  "h-14 w-full rounded-xl border border-white/10 bg-white/5 px-5 text-[15px] font-medium text-white outline-none transition-all placeholder:text-white/30 focus:border-[#a855f7] focus:bg-white/10 focus:ring-4 focus:ring-[#a855f7]/20 shadow-inner";

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-3 block text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">{label}</span>
      {children}
    </label>
  );
}

function ContactBlock({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
        <span className="text-[#c9a4ff]">{icon}</span>
        {title}
      </div>
      <div className="mt-2 text-[15px] leading-[1.6] text-white/90">{children}</div>
    </div>
  );
}
