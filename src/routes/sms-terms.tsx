import { createFileRoute } from "@tanstack/react-router";
import SiteHeader from "@/components/SiteHeader";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import ScrollBackground from "@/components/ScrollBackground";

export const Route = createFileRoute("/sms-terms")({
  head: () => ({
    meta: [
      { title: "SMS Terms & Conditions — StellR IT LLC" },
      { name: "description", content: "Terms and conditions for receiving text messages from StellR IT LLC." },
      { property: "og:title", content: "SMS Terms & Conditions — StellR IT LLC" },
      { property: "og:description", content: "Terms governing SMS messages from StellR IT LLC." },
    ],
  }),
  component: SMSTermsPage,
});

const SECTIONS = [
  {
    t: "Program description",
    d: "StellR IT LLC may send text messages (SMS and MMS) containing transactional updates, project alerts, scheduling notifications, and promotional messages regarding our IT consulting, software development, and digital marketing services.",
  },
  {
    t: "Opt-in consent",
    d: "By providing your phone number and checking the consent box (where applicable) on our website, contact forms, or agreements, you explicitly agree to receive text messages from StellR IT LLC. Consent is not a condition of purchasing any services.",
  },
  {
    t: "Message frequency",
    d: "Message frequency will vary depending on your ongoing requests, project status, and engagement with our support or sales teams. You will only receive messages relevant to your interactions.",
  },
  {
    t: "Message & data rates",
    d: "Standard message and data rates may apply for any messages sent to you from us, or from you to us. Please contact your mobile carrier if you have questions about your text plan or data rates.",
  },
  {
    t: "Opt-out (Unsubscribe)",
    d: "You can cancel the SMS service at any time. Just reply 'STOP' to any text message you receive from us. After you send the message 'STOP' to us, we will send you a confirmation SMS. After this, you will no longer receive SMS messages from us. If you want to join again, just sign up as you did the first time or contact us directly.",
  },
  {
    t: "Help & Support",
    d: "If you are experiencing issues with the messaging program or need assistance, you can reply 'HELP' for more info, or contact us directly at info@stellrit.com or call (214) 838-0543.",
  },
  {
    t: "Privacy & Data Sharing",
    d: "We value your privacy. Your mobile telephone number and SMS consent will not be shared, sold, rented, or leased to third parties or affiliates for marketing or promotional purposes. Please refer to our Privacy Policy for more details on how we handle your personal data.",
  },
];

function SMSTermsPage() {
  return (
    <main className="relative min-h-screen">
      <ScrollBackground />
      <SiteHeader transparent />
      <PageHero
        eyebrow="Legal"
        title="SMS Terms & Conditions"
        description="Last updated July 14, 2026. The terms governing text messages from StellR IT LLC."
      />
      <article className="relative z-10 mx-auto max-w-[860px] px-6 pb-32 md:px-12">
        <div className="space-y-10">
          {SECTIONS.map((s, i) => (
            <section key={s.t}>
              <h2 className="font-serif text-[28px] text-white">
                {i + 1}. {s.t}
              </h2>
              <p className="mt-3 text-[15px] leading-[1.7] text-white/75">{s.d}</p>
            </section>
          ))}
        </div>
      </article>
      <Footer />
    </main>
  );
}
