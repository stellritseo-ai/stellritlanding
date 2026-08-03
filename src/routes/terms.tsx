import { createFileRoute } from "@tanstack/react-router";
import SiteHeader from "@/components/SiteHeader";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import ScrollBackground from "@/components/ScrollBackground";
import { 
  FileText, 
  HelpCircle, 
  Settings, 
  CreditCard, 
  Lock, 
  Users, 
  Briefcase, 
  AlertTriangle, 
  XOctagon, 
  Scale, 
  Edit3, 
  Layers, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2
} from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — StellR IT LLC" },
      { name: "description", content: "Terms of Service governing the use of StellR IT LLC's website, software development services, and digital solutions. Read our complete terms and conditions." },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Terms of Service — StellR IT LLC" },
      { property: "og:description", content: "Terms and conditions governing the use of StellR IT LLC's website and services." },
      { property: "og:url", content: "https://stellrit.com/terms" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://stellrit.com/og-image.png" },
      { property: "og:image:alt", content: "StellR IT LLC Terms of Service" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Terms of Service — StellR IT LLC" },
      { name: "twitter:description", content: "Terms and conditions governing the use of StellR IT LLC's website and services." },
    ],
    links: [{ rel: "canonical", href: "https://stellrit.com/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <main className="relative min-h-screen">
      <ScrollBackground />
      <SiteHeader transparent />
      <PageHero
        eyebrow="Legal"
        title="Terms of Conditions"
        description="Last updated July 14, 2026. The terms governing your use of StellR IT LLC's website and services."
      />

      <article className="relative z-10 mx-auto max-w-[98%] px-6 pb-32 md:px-12">
        {/* Intro Card */}
        <div className="glass rounded-2xl p-6 sm:p-8 md:p-10 mt-[50px] mb-12 shadow-soft">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#7a2adc] to-[#ff8a5b] text-white">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif text-white font-semibold mb-3">Terms & Conditions Overview</h2>
              <p className="text-[15px] sm:text-[16px] leading-[1.7] text-white/80">
                These Terms and Conditions (“Terms”) govern your use of the services and solutions provided by StellR IT LLC. By engaging our services or accessing our website, you agree to follow and be bound by these Terms.
              </p>
            </div>
          </div>
        </div>

        {/* Content sections */}
        <div className="space-y-12">
          
          {/* Section 1: Definitions */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#ff8a5b] text-sm font-semibold border border-white/10">1</span>
              <h2 className="font-serif text-[26px] text-white font-medium">Definitions</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
              <div className="glass rounded-xl p-5 border border-white/5">
                <h3 className="text-white font-semibold text-[15px] mb-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#ff8a5b]"></span>
                  1.1 Client
                </h3>
                <p className="text-[14px] text-white/70 leading-[1.6]">
                  Refers to any individual, business, or entity that engages StellR IT LLC for IT services or solutions.
                </p>
              </div>

              <div className="glass rounded-xl p-5 border border-white/5">
                <h3 className="text-white font-semibold text-[15px] mb-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#7a2adc]"></span>
                  1.2 Services
                </h3>
                <p className="text-[14px] text-white/70 leading-[1.6]">
                  Refers to the IT solutions, consulting, and related software/hardware services StellR IT LLC provides.
                </p>
              </div>

              <div className="glass rounded-xl p-5 border border-white/5">
                <h3 className="text-white font-semibold text-[15px] mb-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#ff8a5b]"></span>
                  1.3 Agreement
                </h3>
                <p className="text-[14px] text-white/70 leading-[1.6]">
                  Refers to the mutually agreed-upon terms outlined in a signed service agreement or statement of work (SOW).
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Services */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#ff8a5b] text-sm font-semibold border border-white/10">2</span>
              <h2 className="font-serif text-[26px] text-white font-medium">Services</h2>
            </div>
            
            <div className="space-y-4">
              {[
                {
                  label: "2.1 Scope of Services",
                  desc: "StellR IT LLC provides IT solutions and services tailored to the Client’s business needs, as outlined in individual agreements or Statements of Work (SOWs)."
                },
                {
                  label: "2.2 Service Delivery",
                  desc: "We will use commercially reasonable efforts to deliver our consulting, optimization, and software development services on time and as specified in the agreed terms."
                },
                {
                  label: "2.3 Service Limitations",
                  desc: "Services are subject to availability, resource capacity, and system constraints. We reserve the right to modify or discontinue any service with proper communication as per individual agreements."
                }
              ].map((item, idx) => (
                <div key={idx} className="glass rounded-xl p-5 border border-white/5 flex gap-4 items-start">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#7a2adc]/10 text-[#a855f7]">
                    <Settings className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-[15px] mb-1">{item.label}</h4>
                    <p className="text-[14px] text-white/70 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Fees and Payment */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#ff8a5b] text-sm font-semibold border border-white/10">3</span>
              <h2 className="font-serif text-[26px] text-white font-medium">Fees and Payment</h2>
            </div>
            
            <div className="space-y-4">
              {[
                {
                  label: "3.1 Fees",
                  desc: "The Client agrees to pay the fees outlined in the service agreement or SOW. All fees are subject to applicable local, state, and federal taxes unless valid exemption documentation is provided."
                },
                {
                  label: "3.2 Payment Terms",
                  desc: "Invoices and payments are due within thirty (30) days of the invoice date unless otherwise explicitly specified in the signed service agreement."
                },
                {
                  label: "3.3 Late Payments",
                  desc: "Late payments are subject to interest charges or suspension of services as permitted under the law and specified in your contract."
                }
              ].map((item, idx) => (
                <div key={idx} className="glass rounded-xl p-5 border border-white/5 flex gap-4 items-start">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ff8a5b]/10 text-[#ff8a5b]">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-[15px] mb-1">{item.label}</h4>
                    <p className="text-[14px] text-white/70 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: Confidentiality and Data Security */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#ff8a5b] text-sm font-semibold border border-white/10">4</span>
              <h2 className="font-serif text-[26px] text-white font-medium">Confidentiality and Data Security</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="glass rounded-xl p-5 border border-white/5 flex gap-4 items-start">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#7a2adc]/10 text-[#a855f7]">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-[15px] mb-1">4.1 Confidential Information</h4>
                  <p className="text-[14px] text-white/70 leading-relaxed">
                    Both parties agree to keep all non-public information, source code, strategies, and credentials exchanged during the engagement strictly confidential.
                  </p>
                </div>
              </div>

              <div className="glass rounded-xl p-5 border border-white/5 flex gap-4 items-start">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ff8a5b]/10 text-[#ff8a5b]">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-[15px] mb-1">4.2 Data Security</h4>
                  <p className="text-[14px] text-white/70 leading-relaxed">
                    We implement industry-standard security measures to protect Client data. However, we are not liable for unauthorized access, hacking, or breaches outside our reasonable control.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Client Responsibilities */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#ff8a5b] text-sm font-semibold border border-white/10">5</span>
              <h2 className="font-serif text-[26px] text-white font-medium">Client Responsibilities</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="glass rounded-xl p-5 border border-white/5 flex gap-4 items-start">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ff8a5b]/10 text-[#ff8a5b]">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-[15px] mb-1">5.1 Access and Cooperation</h4>
                  <p className="text-[14px] text-white/70 leading-relaxed">
                    The Client must provide StellR IT LLC with timely access to necessary resources, IT systems, database credentials, and personnel to deliver services effectively.
                  </p>
                </div>
              </div>

              <div className="glass rounded-xl p-5 border border-white/5 flex gap-4 items-start">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#7a2adc]/10 text-[#a855f7]">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-[15px] mb-1">5.2 Compliance</h4>
                  <p className="text-[14px] text-white/70 leading-relaxed">
                    The Client is responsible for ensuring compliance with all applicable local, federal, and industry laws and regulations regarding their use of our IT services and software solutions.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6: Intellectual Property */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#ff8a5b] text-sm font-semibold border border-white/10">6</span>
              <h2 className="font-serif text-[26px] text-white font-medium">Intellectual Property</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="glass rounded-xl p-5 border border-white/5 flex gap-4 items-start">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#7a2adc]/10 text-[#a855f7]">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-[15px] mb-1">6.1 Ownership</h4>
                  <p className="text-[14px] text-white/70 leading-relaxed">
                    StellR IT LLC retains ownership of all pre-existing intellectual property, including developed proprietary tools, design assets, templates, and programming methodologies.
                  </p>
                </div>
              </div>

              <div className="glass rounded-xl p-5 border border-white/5 flex gap-4 items-start">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ff8a5b]/10 text-[#ff8a5b]">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-[15px] mb-1">6.2 License</h4>
                  <p className="text-[14px] text-white/70 leading-relaxed">
                    Upon full invoice payment, the Client receives a non-exclusive, non-transferable license to use deliverables solely for their intended business purposes.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 7: Limitation of Liability */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#ff8a5b] text-sm font-semibold border border-white/10">7</span>
              <h2 className="font-serif text-[26px] text-white font-medium">Limitation of Liability</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="glass rounded-xl p-5 border border-white/5 flex gap-4 items-start">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ff8a5b]/10 text-[#ff8a5b]">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-[15px] mb-1">7.1 Exclusion of Damages</h4>
                  <p className="text-[14px] text-white/70 leading-relaxed">
                    StellR IT LLC is not liable for indirect, incidental, special, or consequential damages, including lost profits, data loss, or business interruptions.
                  </p>
                </div>
              </div>

              <div className="glass rounded-xl p-5 border border-white/5 flex gap-4 items-start">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#7a2adc]/10 text-[#a855f7]">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-[15px] mb-1">7.2 Maximum Liability</h4>
                  <p className="text-[14px] text-white/70 leading-relaxed">
                    Our total cumulative liability under any SOW or Agreement is limited to the amount paid by the Client to us for the specific services giving rise to the claim.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 8: Termination */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#ff8a5b] text-sm font-semibold border border-white/10">8</span>
              <h2 className="font-serif text-[26px] text-white font-medium">Termination</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="glass rounded-xl p-5 border border-white/5 flex gap-4 items-start">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#7a2adc]/10 text-[#a855f7]">
                  <XOctagon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-[15px] mb-1">8.1 Termination by Either Party</h4>
                  <p className="text-[14px] text-white/70 leading-relaxed">
                    Either party may terminate a service agreement or Statement of Work at any time with a thirty (30) days’ written notice.
                  </p>
                </div>
              </div>

              <div className="glass rounded-xl p-5 border border-white/5 flex gap-4 items-start">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ff8a5b]/10 text-[#ff8a5b]">
                  <XOctagon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-[15px] mb-1">8.2 Termination for Cause</h4>
                  <p className="text-[14px] text-white/70 leading-relaxed">
                    Either party may terminate immediately for a material contract breach that remains unremedied for ten (10) days after written notification.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 9: Governing Law and Dispute Resolution */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#ff8a5b] text-sm font-semibold border border-white/10">9</span>
              <h2 className="font-serif text-[26px] text-white font-medium">Governing Law and Dispute Resolution</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="glass rounded-xl p-5 border border-white/5 flex gap-4 items-start">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ff8a5b]/10 text-[#ff8a5b]">
                  <Scale className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-[15px] mb-1">9.1 Governing Law</h4>
                  <p className="text-[14px] text-white/70 leading-relaxed">
                    These Terms and Conditions are governed by, and construed in accordance with, the laws of the State of Texas, USA.
                  </p>
                </div>
              </div>

              <div className="glass rounded-xl p-5 border border-white/5 flex gap-4 items-start">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#7a2adc]/10 text-[#a855f7]">
                  <Scale className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-[15px] mb-1">9.2 Dispute Resolution</h4>
                  <p className="text-[14px] text-white/70 leading-relaxed">
                    Any dispute, controversy, or claim arising out of these terms will be resolved through mediation or arbitration in Dallas, Texas.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 10: Amendments */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#ff8a5b] text-sm font-semibold border border-white/10">10</span>
              <h2 className="font-serif text-[26px] text-white font-medium">Amendments</h2>
            </div>
            <div className="glass rounded-xl p-6 border border-white/5 flex gap-4 items-start">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#7a2adc]/10 text-[#a855f7] mt-0.5">
                <Edit3 className="h-5 w-5" />
              </div>
              <p className="text-[15px] text-white/75 leading-[1.7]">
                StellR IT LLC reserves the right to amend or update these Terms and Conditions at any time. We will post modified versions to this page with a revised effective date. Continued use of our solutions or services constitutes acceptance of the new terms.
              </p>
            </div>
          </section>

          {/* Section 11: Entire Agreement */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#ff8a5b] text-sm font-semibold border border-white/10">11</span>
              <h2 className="font-serif text-[26px] text-white font-medium">Entire Agreement</h2>
            </div>
            <div className="glass rounded-xl p-6 border border-white/5 flex gap-4 items-start">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[#ff8a5b] mt-0.5">
                <Layers className="h-5 w-5" />
              </div>
              <p className="text-[15px] text-white/75 leading-[1.7]">
                These Terms and Conditions, together with any mutually signed service agreements or Statements of Work (SOW), constitute the entire, complete agreement between StellR IT LLC and the Client.
              </p>
            </div>
          </section>

          {/* Section 12: Contact Us */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#ff8a5b] text-sm font-semibold border border-white/10">12</span>
              <h2 className="font-serif text-[26px] text-white font-medium">Contact Us</h2>
            </div>
            <p className="text-[15px] text-white/70 leading-[1.7]">
              If you have any questions, requests, or require additional information regarding our Terms and Conditions, please contact us:
            </p>
            
            <div className="glass rounded-xl p-6 border border-white/5 max-w-[500px] space-y-4 shadow-soft">
              <h3 className="text-[18px] text-white font-serif font-semibold border-b border-white/10 pb-2">StellR IT LLC</h3>
              <ul className="space-y-3">
                <li className="flex gap-3 text-[14px] text-white/80">
                  <MapPin className="h-4.5 w-4.5 text-[#ff8a5b] shrink-0 mt-0.5" />
                  <span>5305 Creek CT, Garland, TX 75043</span>
                </li>
                <li className="flex gap-3 text-[14px] text-white/80">
                  <Mail className="h-4.5 w-4.5 text-[#ff8a5b] shrink-0 mt-0.5" />
                  <a href="mailto:info@stellrit.com" className="hover:underline">info@stellrit.com</a>
                </li>
                <li className="flex gap-3 text-[14px] text-white/80">
                  <Phone className="h-4.5 w-4.5 text-[#ff8a5b] shrink-0 mt-0.5" />
                  <a href="tel:2148380543" className="hover:underline">(214) 838-0543</a>
                </li>
              </ul>
            </div>
          </section>

          {/* Conclusion Disclaimer */}
          <section className="pt-4">
            <div className="relative rounded-2xl overflow-hidden p-[1px] bg-gradient-to-r from-[#7a2adc] via-[#a855f7] to-[#ff8a5b]">
              <div className="rounded-2xl bg-[#180028]/95 p-6 sm:p-8 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ff8a5b]/10 text-[#ff8a5b]">
                    <CheckCircle2 className="h-5 w-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-white font-serif font-semibold text-[18px] mb-2 tracking-wide font-sans">AGREEMENT ACKNOWLEDGEMENT</h3>
                    <p className="text-[15px] text-white/85 leading-[1.6]">
                      By engaging our services, you acknowledge and agree to follow these Terms and Conditions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </article>
      <Footer />
    </main>
  );
}
