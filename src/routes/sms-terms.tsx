import { createFileRoute } from "@tanstack/react-router";
import SiteHeader from "@/components/SiteHeader";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import ScrollBackground from "@/components/ScrollBackground";
import { 
  MessageSquare, 
  UserCheck, 
  HelpCircle, 
  MessageCircle, 
  VolumeX, 
  ShieldAlert, 
  Users, 
  FileText, 
  Check, 
  Info,
  CheckCircle2
} from "lucide-react";

export const Route = createFileRoute("/sms-terms")({
  head: () => ({
    meta: [
      { title: "SMS Terms & Conditions — StellR IT LLC" },
      { name: "description", content: "Terms and conditions governing text messages from StellR IT LLC." },
      { property: "og:title", content: "SMS Terms & Conditions — StellR IT LLC" },
      { property: "og:description", content: "Terms and conditions governing text messages from StellR IT LLC." },
    ],
  }),
  component: SMSTermsPage,
});

function SMSTermsPage() {
  return (
    <main className="relative min-h-screen">
      <ScrollBackground />
      <SiteHeader transparent />
      <PageHero
        eyebrow="Legal"
        title="SMS Terms & Conditions"
        description="Last updated July 14, 2026. The terms governing text messages and SMS communications from StellR IT LLC."
      />

      <article className="relative z-10 mx-auto max-w-[98%] px-6 pb-32 md:px-12">
        {/* Intro Card */}
        <div className="glass rounded-2xl p-6 sm:p-8 md:p-10 mt-[50px] mb-12 shadow-soft">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#7a2adc] to-[#ff8a5b] text-white">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif text-white font-semibold mb-3">SMS Communications Policy</h2>
              <p className="text-[15px] sm:text-[16px] leading-[1.7] text-white/80">
                StellR IT LLC values open and efficient communication with customers, guests, and job applicants. We use SMS (text messaging) as a communication tool to provide timely updates. By consenting to receive SMS communications, you acknowledge and agree to the terms outlined below:
              </p>
            </div>
          </div>
        </div>

        {/* Content sections */}
        <div className="space-y-12">
          
          {/* Section 1: Consent for SMS */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#ff8a5b] text-sm font-semibold border border-white/10">1</span>
              <h2 className="font-serif text-[26px] text-white font-medium">Consent for SMS Communication</h2>
            </div>
            <div className="glass rounded-xl p-6 border border-white/5 flex gap-4 items-start">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ff8a5b]/10 text-[#ff8a5b] mt-0.5">
                <Check className="h-5 w-5" />
              </div>
              <p className="text-[15px] text-white/75 leading-[1.7]">
                By providing your consent to receive SMS communications, you acknowledge and agree to receive text messages from StellR IT LLC at the phone number you provide. Information obtained as part of the SMS consent process will not be shared with third parties or affiliates under any circumstance.
              </p>
            </div>
          </section>

          {/* Section 2: Types of SMS Communication */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#ff8a5b] text-sm font-semibold border border-white/10">2</span>
              <h2 className="font-serif text-[26px] text-white font-medium">Types of SMS Communication</h2>
            </div>
            <p className="text-[15px] text-white/70 leading-[1.7]">
              Our text messages support various support interactions and service notification flows. Examples and scopes include:
            </p>

            {/* Example dialogues */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div className="glass rounded-xl p-5 border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-bl from-[#7a2adc]/10 to-transparent pointer-events-none" />
                <span className="text-[11px] font-semibold text-[#a855f7] uppercase tracking-wider block mb-2">Example Support Request</span>
                <blockquote className="text-[13px] italic text-white/75 border-l-2 border-[#7a2adc] pl-3 leading-relaxed">
                  “Hi StellR IT Support, I’m experiencing an issue with our server connectivity. Can you assist us in troubleshooting? Please let me know the next steps. Thanks!”
                </blockquote>
              </div>
              
              <div className="glass rounded-xl p-5 border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-bl from-[#ff8a5b]/10 to-transparent pointer-events-none" />
                <span className="text-[11px] font-semibold text-[#ff8a5b] uppercase tracking-wider block mb-2">Example Resolution Confirmation</span>
                <blockquote className="text-[13px] italic text-white/75 border-l-2 border-[#ff8a5b] pl-3 leading-relaxed">
                  “Hi, StellR IT; thank you for resolving our email server issue. Just wanted to confirm if the update included the requested spam filter improvements?”
                </blockquote>
              </div>
            </div>

            {/* Split cards for Customers vs Applicants */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass rounded-xl p-6 border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ff8a5b]/10 text-[#ff8a5b]">
                    <Users className="h-5 w-5" />
                  </div>
                  <h3 className="text-white font-semibold text-[17px] font-serif">Customers & Guests</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "Notifications regarding services, appointments, or consultations.",
                    "Updates about our products, services, promotions, and events.",
                    "Customer support requests or service quality feedback."
                  ].map((text, idx) => (
                    <li key={idx} className="flex gap-2 items-start text-[14px] text-white/80">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#ff8a5b] shrink-0 mt-2" />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass rounded-xl p-6 border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#7a2adc]/10 text-[#a855f7]">
                    <Users className="h-5 w-5" />
                  </div>
                  <h3 className="text-white font-semibold text-[17px] font-serif">Job Applicants</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "Updates regarding the status of job applications.",
                    "Interview scheduling, virtual link details, and calendar reminders.",
                    "Notifications regarding matching job openings and career opportunities."
                  ].map((text, idx) => (
                    <li key={idx} className="flex gap-2 items-start text-[14px] text-white/80">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#7a2adc] shrink-0 mt-2" />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3: Disclosures */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#ff8a5b] text-sm font-semibold border border-white/10">3</span>
              <h2 className="font-serif text-[26px] text-white font-medium">Standard Messaging Disclosures</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="glass rounded-xl p-5 border border-white/5">
                <h4 className="text-[#ff8a5b] font-semibold text-[14px] uppercase tracking-wider mb-2">Message Frequency</h4>
                <p className="text-[13px] text-white/75 leading-relaxed">
                  You may receive approximately 8-10 messages per day related to your support requests. However, frequency will vary based on your interaction.
                </p>
              </div>

              <div className="glass rounded-xl p-5 border border-white/5">
                <h4 className="text-white font-semibold text-[14px] uppercase tracking-wider mb-2">Rates & Fees</h4>
                <p className="text-[13px] text-white/75 leading-relaxed">
                  StellR IT LLC does not charge for SMS services. However, standard message and data rates from your mobile carrier may apply.
                </p>
              </div>

              <div className="glass rounded-xl p-5 border border-white/5">
                <h4 className="text-[#a855f7] font-semibold text-[14px] uppercase tracking-wider mb-2">Support & Help</h4>
                <p className="text-[13px] text-white/75 leading-relaxed">
                  For immediate assistance, text "HELP" or contact us directly. Learn more on our{" "}
                  <a href="/terms" className="underline hover:text-white transition-colors">Terms of Conditions</a> page.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Opt-In Method */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#ff8a5b] text-sm font-semibold border border-white/10">4</span>
              <h2 className="font-serif text-[26px] text-white font-medium">Opt-In Method</h2>
            </div>
            <p className="text-[15px] text-white/70 leading-[1.7]">
              You may opt-in to receive SMS notifications and support updates from StellR IT LLC in the following ways:
            </p>
            <div className="glass rounded-xl p-5 border border-white/5 flex flex-col sm:flex-row gap-4 justify-around">
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ff8a5b]/10 text-[#ff8a5b] text-[12px] font-bold">1</span>
                <span className="text-[14px] text-white/90">Verbally, during a support conversation or consultation</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#7a2adc]/10 text-[#a855f7] text-[12px] font-bold">2</span>
                <span className="text-[14px] text-white/90">By checking the consent box on our online web forms</span>
              </div>
            </div>
          </section>

          {/* Section 5: Opt-Out Method */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#ff8a5b] text-sm font-semibold border border-white/10">5</span>
              <h2 className="font-serif text-[26px] text-white font-medium">Opt-Out Method</h2>
            </div>
            <div className="glass rounded-xl p-6 border border-white/5 flex gap-4 items-start">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ff8a5b]/10 text-[#ff8a5b] mt-0.5">
                <VolumeX className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-[15px] mb-1">Cancel at Any Time</h4>
                <p className="text-[14px] text-white/70 leading-relaxed">
                  You can opt-out of receiving SMS messages from us at any time. Simply reply “STOP” to any text message you receive from us. We will send a final confirmation text message, and then suspend all text communications. You can also contact us directly to request removal from our messaging list.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6: Additional Options */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#ff8a5b] text-sm font-semibold border border-white/10">6</span>
              <h2 className="font-serif text-[26px] text-white font-medium">Additional Options</h2>
            </div>
            <div className="glass rounded-xl p-6 border border-white/5 flex gap-4 items-start">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#7a2adc]/10 text-[#a855f7] mt-0.5">
                <Info className="h-5 w-5" />
              </div>
              <p className="text-[14px] text-white/70 leading-relaxed">
                If you do not wish to receive SMS messages regarding scheduling, project updates, or support, you can simply choose not to check the SMS consent box when completing our contact or registration forms.
              </p>
            </div>
          </section>

          {/* Compliance Disclaimer */}
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
                      By consenting to receive SMS communications, you acknowledge and agree to follow these SMS Terms and Conditions.
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
