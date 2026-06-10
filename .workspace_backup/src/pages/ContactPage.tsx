import { useEffect, useState } from "react";

import { toast } from "sonner";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import ScrollBackground from "@/components/ScrollBackground";
import ChatWidget from "@/components/ChatWidget";

const BUDGETS = ["< $25k", "$25k – $75k", "$75k – $200k", "$200k+"];
const SERVICES_LIST = ["Brand", "Product Design", "Engineering", "Growth", "Other"];

const inputCls = "h-12 w-full border-b border-white/15 bg-transparent py-2 text-[15px] text-white outline-none transition placeholder:text-white/30 focus:border-[#ff8a5b]";

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-[12px] uppercase tracking-[0.25em] text-white/55">{label}</span>
      {children}
    </label>
  );
}

function ContactBlock({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.3em] text-[#ff8a5b]">
        <span className="text-white/70">{icon}</span>{title}
      </div>
      <div className="mt-3 text-[15px] leading-[1.6] text-white/80">{children}</div>
    </div>
  );
}

export default function ContactPage() {
  useEffect(() => { document.title = "Contact — Start a Project | StellR IT LLC"; }, []);
  const [form, setForm] = useState({ name: "", email: "", company: "", budget: BUDGETS[1], service: SERVICES_LIST[0], message: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) { toast.error("Please fill in name, email and a short message."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { toast.error("Please enter a valid email address."); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setForm({ name: "", email: "", company: "", budget: BUDGETS[1], service: SERVICES_LIST[0], message: "" });
    toast.success("Thanks — we'll be in touch within one business day.");
  };

  return (
    <main className="relative min-h-screen">
      <ScrollBackground />
      <SiteHeader transparent />
      <PageHero
        eyebrow="Contact"
        title={<>Let's start <em className="font-serif italic text-[#c9a4ff]">something</em> great.</>}
        description="Tell us about your project — timeline, budget range, the problem you're solving. A senior partner replies within one business day."
      />

      <section className="relative z-10 px-6 pb-24 md:px-12 lg:px-20">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-16 lg:grid-cols-[1fr_360px]">
          <form onSubmit={submit} className="md:pr-12">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field label="Your name"><input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="Jane Doe" /></Field>
              <Field label="Work email"><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} placeholder="jane@company.com" /></Field>
              <Field label="Company"><input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={inputCls} placeholder="Acme Inc." /></Field>
              <Field label="Service interest">
                <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className={inputCls}>
                  {SERVICES_LIST.map((s) => <option key={s} value={s} className="bg-[#1a0533]">{s}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Budget range" className="mt-6">
              <div className="flex flex-wrap gap-2">
                {BUDGETS.map((b) => (
                  <button key={b} type="button" onClick={() => setForm({ ...form, budget: b })} className={`rounded-full border px-4 py-2 text-[13px] transition ${form.budget === b ? "border-[#ff8a5b] bg-[#ff8a5b]/10 text-white" : "border-white/15 text-white/70 hover:border-white/40"}`}>{b}</button>
                ))}
              </div>
            </Field>
            <Field label="Tell us about your project" className="mt-6">
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={6} className={inputCls + " resize-none"} placeholder="Goals, timeline, what success looks like…" />
            </Field>
            <button type="submit" disabled={loading} className="group mt-8 inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-[15px] font-semibold text-[#2a0860] transition hover:bg-white/90 disabled:opacity-60">
              {loading ? "Sending…" : "Send message"}
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#a855f7] to-[#7c2dd9] text-white transition group-hover:scale-110"><ArrowUpRight className="h-4 w-4" /></span>
            </button>
          </form>
          <aside className="space-y-10">
            <ContactBlock icon={<Mail className="h-4 w-4" />} title="Email"><a href="mailto:hello@stellr.it" className="hover:text-[#ff8a5b]">hello@stellr.it</a></ContactBlock>
            <ContactBlock icon={<Phone className="h-4 w-4" />} title="Phone"><a href="tel:8559185940" className="hover:text-[#ff8a5b]">855‑918‑5940</a></ContactBlock>
            <ContactBlock icon={<MapPin className="h-4 w-4" />} title="Los Angeles">633 W 5th St, Floor 26<br />Los Angeles, CA 90071</ContactBlock>
            <ContactBlock icon={<MapPin className="h-4 w-4" />} title="Lahore">576 Block Q, Phase 2<br />Johar Town, Lahore 54782</ContactBlock>
          </aside>
        </div>
      </section>
      <Footer />
      <ChatWidget />
    </main>
  );
}
