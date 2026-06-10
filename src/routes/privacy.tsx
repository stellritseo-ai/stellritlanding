import { createFileRoute } from "@tanstack/react-router";
import SiteHeader from "@/components/SiteHeader";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import ScrollBackground from "@/components/ScrollBackground";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — StellR IT LLC" },
      { name: "description", content: "How StellR IT LLC collects, uses and protects your information." },
      { property: "og:title", content: "Privacy Policy — StellR IT LLC" },
      { property: "og:description", content: "How StellR IT collects, uses and protects your information." },
    ],
  }),
  component: PrivacyPage,
});

const SECTIONS = [
  {
    t: "Information we collect",
    d: "We collect information you provide directly (such as when you contact us or subscribe to our newsletter) and limited technical information your browser sends automatically (IP address, user agent, referrer).",
  },
  {
    t: "How we use information",
    d: "To respond to inquiries, deliver requested content, improve our website, ensure security, and comply with legal obligations. We do not sell personal information.",
  },
  {
    t: "Cookies & analytics",
    d: "We use first-party analytics with IP anonymisation to understand aggregate usage. You can disable cookies in your browser at any time.",
  },
  {
    t: "Data sharing",
    d: "We share data only with vetted processors who help us operate the site (hosting, email delivery) under contractual data-protection terms.",
  },
  {
    t: "Your rights",
    d: "Under GDPR and CCPA you may request access, correction or deletion of your personal data. Email privacy@stellr.it and we'll respond within 30 days.",
  },
  {
    t: "Retention",
    d: "We retain personal data only as long as needed for the purpose collected, or as required by law.",
  },
  {
    t: "Contact",
    d: "Questions? Email privacy@stellr.it or write to StellR IT LLC, 633 W 5th St, Floor 26, Los Angeles, CA 90071.",
  },
];

function PrivacyPage() {
  return (
    <main className="relative min-h-screen">
      <ScrollBackground />
      <SiteHeader transparent />
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="Last updated June 10, 2026. This policy explains what we collect, why, and what choices you have."
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
