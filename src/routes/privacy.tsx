import { createFileRoute } from "@tanstack/react-router";
import SiteHeader from "@/components/SiteHeader";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import ScrollBackground from "@/components/ScrollBackground";
import { 
  Shield, 
  Info, 
  Settings, 
  Share2, 
  Lock, 
  UserCheck, 
  Cookie, 
  ExternalLink, 
  Baby, 
  RefreshCw, 
  Mail, 
  Phone, 
  MapPin, 
  AlertCircle,
  Check
} from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — StellR IT LLC" },
      { name: "description", content: "StellR IT LLC Privacy Policy — Learn how we collect, use, and protect your personal information. We are committed to data privacy and security for all our clients and website visitors." },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Privacy Policy — StellR IT LLC" },
      { property: "og:description", content: "How StellR IT LLC collects, uses, and protects your information. Read our full privacy policy." },
      { property: "og:url", content: "https://stellrit.com/privacy" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://stellrit.com/og-image.png" },
      { property: "og:image:alt", content: "StellR IT LLC Privacy Policy" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Privacy Policy — StellR IT LLC" },
      { name: "twitter:description", content: "How StellR IT LLC collects, uses, and protects your information." },
    ],
    links: [{ rel: "canonical", href: "https://stellrit.com/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <main className="relative min-h-screen">
      <ScrollBackground />
      <SiteHeader transparent />
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="Last updated July 14, 2026. This policy explains what we collect, why, and how we protect your privacy."
      />

      <article className="relative z-10 mx-auto max-w-[98%] px-6 pb-32 md:px-12">
        {/* Intro Card */}
        <div className="glass rounded-2xl p-6 sm:p-8 md:p-10 mt-[50px] mb-12 shadow-soft">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#7a2adc] to-[#ff8a5b] text-white">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif text-white font-semibold mb-3">Our Privacy Commitment</h2>
              <p className="text-[15px] sm:text-[16px] leading-[1.7] text-white/80">
                StellR IT LLC is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you interact with our website, services, and solutions. Please read this policy carefully to understand our practices regarding your information.
              </p>
            </div>
          </div>
        </div>

        {/* Core content grid */}
        <div className="space-y-12">
          {/* Section 1: Information We Collect */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#ff8a5b] text-sm font-semibold border border-white/10">1</span>
              <h2 className="font-serif text-[26px] text-white font-medium">Information We Collect</h2>
            </div>
            <p className="text-[15px] text-white/70 leading-[1.7]">
              We may collect the following types of information when you interact with us or use our IT services and solutions:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
              <div className="glass rounded-xl p-5 border border-white/5 hover:border-white/10 transition-colors">
                <h3 className="text-white font-semibold text-[16px] flex items-center gap-2 mb-2">
                  <span className="h-2 w-2 rounded-full bg-[#ff8a5b]"></span>
                  Personal Information
                </h3>
                <p className="text-[14px] text-white/70 leading-[1.6]">
                  Name, email address, phone number, job title, and company details when you engage with us or use our services.
                </p>
              </div>

              <div className="glass rounded-xl p-5 border border-white/5 hover:border-white/10 transition-colors">
                <h3 className="text-white font-semibold text-[16px] flex items-center gap-2 mb-2">
                  <span className="h-2 w-2 rounded-full bg-[#7a2adc]"></span>
                  Technical Information
                </h3>
                <p className="text-[14px] text-white/70 leading-[1.6]">
                  IP address, browser type, device information, and usage data when you visit our website or use our IT solutions.
                </p>
              </div>

              <div className="glass rounded-xl p-5 border border-white/5 hover:border-white/10 transition-colors">
                <h3 className="text-white font-semibold text-[16px] flex items-center gap-2 mb-2">
                  <span className="h-2 w-2 rounded-full bg-[#7a2adc]"></span>
                  Financial Information
                </h3>
                <p className="text-[14px] text-white/70 leading-[1.6]">
                  Billing details, payment information, and transaction history when you procure our services.
                </p>
              </div>

              <div className="glass rounded-xl p-5 border border-white/5 hover:border-white/10 transition-colors">
                <h3 className="text-white font-semibold text-[16px] flex items-center gap-2 mb-2">
                  <span className="h-2 w-2 rounded-full bg-[#ff8a5b]"></span>
                  Other Information
                </h3>
                <p className="text-[14px] text-white/70 leading-[1.6]">
                  Any data you voluntarily provide, such as through contact forms, surveys, or customer support communications.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: How We Use Your Information */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#ff8a5b] text-sm font-semibold border border-white/10">2</span>
              <h2 className="font-serif text-[26px] text-white font-medium">How We Use Your Information</h2>
            </div>
            <p className="text-[15px] text-white/70 leading-[1.7]">
              We use the collected information for various essential operational, support, and marketing purposes:
            </p>
            
            <div className="glass rounded-xl p-6 shadow-sm border border-white/5">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Delivering and maintaining our IT services.",
                  "Responding to your inquiries and providing support.",
                  "Improving our website, solutions, and experience.",
                  "Processing transactions and managing billing.",
                  "Sending updates, newsletters, and promo materials.",
                  "Ensuring compliance with laws and regulations."
                ].map((text, index) => (
                  <li key={index} className="flex gap-3 items-start">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ff8a5b]/10 text-[#ff8a5b] mt-0.5">
                      <Check className="h-3 w-3" />
                    </span>
                    <span className="text-[14px] text-white/85 leading-relaxed">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 3: Sharing Your Information */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#ff8a5b] text-sm font-semibold border border-white/10">3</span>
              <h2 className="font-serif text-[26px] text-white font-medium">Sharing Your Information</h2>
            </div>
            <p className="text-[15px] text-white/70 leading-[1.7]">
              We do not sell or rent your personal information to third parties. However, we may share your data in the following restricted scenarios:
            </p>

            <div className="space-y-4">
              {[
                {
                  title: "Service Providers",
                  desc: "We share details with trusted third-party partners who assist in delivering our services, under strict confidentiality and data-processing agreements."
                },
                {
                  title: "Legal Authorities",
                  desc: "We may disclose information if required by applicable law, regulation, subpoena, or to protect our legal rights and prevent fraud."
                },
                {
                  title: "Business Transfers",
                  desc: "In the event of a merger, acquisition, restructuring, or sale of company assets, information may be transferred to the successor entity."
                }
              ].map((item, idx) => (
                <div key={idx} className="glass rounded-xl p-5 border border-white/5 flex gap-4 items-start">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#7a2adc]/10 text-[#a855f7]">
                    <Share2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-[15px] mb-1">{item.title}</h4>
                    <p className="text-[14px] text-white/70 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: Data Security */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#ff8a5b] text-sm font-semibold border border-white/10">4</span>
              <h2 className="font-serif text-[26px] text-white font-medium">Data Security</h2>
            </div>
            <div className="glass rounded-xl p-6 border border-white/5 flex gap-4 items-start">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ff8a5b]/10 text-[#ff8a5b] mt-0.5">
                <Lock className="h-5 w-5" />
              </div>
              <p className="text-[15px] text-white/75 leading-[1.7]">
                We implement industry-standard administrative, physical, and technical security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. While we strive to protect your data with state-of-the-art protections, no transmission method or electronic storage system can guarantee complete security.
              </p>
            </div>
          </section>

          {/* Section 5: Your Rights */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#ff8a5b] text-sm font-semibold border border-white/10">5</span>
              <h2 className="font-serif text-[26px] text-white font-medium">Your Rights</h2>
            </div>
            <p className="text-[15px] text-white/70 leading-[1.7]">
              Depending on your location and local laws, you have specific rights regarding your personal information, including:
            </p>

            <div className="glass rounded-xl p-6 border border-white/5">
              <ul className="space-y-3">
                {[
                  "Access, update, or request deletion of your personal information.",
                  "Withdraw consent for marketing communications or newsletters.",
                  "Request detailed information on how your data is being processed and used."
                ].map((right, idx) => (
                  <li key={idx} className="flex gap-3 items-center text-[14px] text-white/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#ff8a5b]" />
                    <span>{right}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-5 border-t border-white/10 text-[14px] text-white/70">
                To exercise any of these privacy rights, please reach out to us directly at{" "}
                <a href="mailto:info@stellrit.com" className="text-[#ff8a5b] hover:underline font-semibold">
                  info@stellrit.com
                </a>.
              </div>
            </div>
          </section>

          {/* Section 6: Cookies & Tracking */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#ff8a5b] text-sm font-semibold border border-white/10">6</span>
              <h2 className="font-serif text-[26px] text-white font-medium">Cookies and Tracking Technologies</h2>
            </div>
            <div className="glass rounded-xl p-6 border border-white/5 flex gap-4 items-start">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#7a2adc]/10 text-[#a855f7] mt-0.5">
                <Cookie className="h-5 w-5" />
              </div>
              <p className="text-[15px] text-white/75 leading-[1.7]">
                We use cookies and similar tracking technologies to enhance your browsing experience, personalize content, and analyze website traffic. You can choose to accept, reject, or manage cookie preferences directly through your browser settings.
              </p>
            </div>
          </section>

          {/* Section 7: Third-Party Links */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#ff8a5b] text-sm font-semibold border border-white/10">7</span>
              <h2 className="font-serif text-[26px] text-white font-medium">Third-Party Links</h2>
            </div>
            <div className="glass rounded-xl p-6 border border-white/5 flex gap-4 items-start">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[#ff8a5b] mt-0.5">
                <ExternalLink className="h-5 w-5" />
              </div>
              <p className="text-[15px] text-white/75 leading-[1.7]">
                Our website may contain links to third-party websites for your convenience. We are not responsible for the privacy practices, content, or security of these external sites. We strongly recommend reviewing their privacy policies before disclosing any personal information.
              </p>
            </div>
          </section>

          {/* Section 8: Children's Privacy */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#ff8a5b] text-sm font-semibold border border-white/10">8</span>
              <h2 className="font-serif text-[26px] text-white font-medium">Children’s Privacy</h2>
            </div>
            <div className="glass rounded-xl p-6 border border-white/5 flex gap-4 items-start">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#7a2adc]/10 text-[#a855f7] mt-0.5">
                <Baby className="h-5 w-5" />
              </div>
              <p className="text-[15px] text-white/75 leading-[1.7]">
                Our services, site, and solutions are not directed to children under 13 years of age. We do not knowingly collect, store, or process personal information from children. If we discover we have inadvertently collected such data, we will purge it immediately.
              </p>
            </div>
          </section>

          {/* Section 9: Changes to Policy */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#ff8a5b] text-sm font-semibold border border-white/10">9</span>
              <h2 className="font-serif text-[26px] text-white font-medium">Changes to This Policy</h2>
            </div>
            <div className="glass rounded-xl p-6 border border-white/5 flex gap-4 items-start">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[#ff8a5b] mt-0.5">
                <RefreshCw className="h-5 w-5" />
              </div>
              <p className="text-[15px] text-white/75 leading-[1.7]">
                We may revise and update this Privacy Policy periodically. Any modifications will be posted to this page with the revised effective date at the top. We encourage you to review this page regularly to stay informed.
              </p>
            </div>
          </section>

          {/* Section 10: Contact Us */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#ff8a5b] text-sm font-semibold border border-white/10">10</span>
              <h2 className="font-serif text-[26px] text-white font-medium">Contact Us</h2>
            </div>
            <p className="text-[15px] text-white/70 leading-[1.7]">
              For any questions, requests, or concerns regarding your privacy or our data practices, please contact our team:
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

          {/* Compliance Disclaimer */}
          <section className="pt-4">
            <div className="relative rounded-2xl overflow-hidden p-[1px] bg-gradient-to-r from-[#7a2adc] via-[#a855f7] to-[#ff8a5b]">
              <div className="rounded-2xl bg-[#180028]/95 p-6 sm:p-8 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ff8a5b]/10 text-[#ff8a5b]">
                    <AlertCircle className="h-5 w-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-white font-serif font-semibold text-[18px] mb-2 tracking-wide">SMS COMPLIANCE DISCLAIMER</h3>
                    <p className="text-[14px] text-white/85 leading-[1.6]">
                      SMS Opt-In consent and the phone numbers we collect for the purpose of SMS will not be shared with third parties or affiliates under any circumstances.
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
