import liveNation from "@/assets/case-livenation.jpg";
import upli from "@/assets/case-upli.jpg";
import tilton from "@/assets/case-tilton.jpg";
import newscorp from "@/assets/case-newscorp.jpg";

export type CaseStudy = {
  slug: string;
  title: string;
  subtitle: string;
  client: string;
  year: string;
  industry: string;
  tags: string[];
  hero: string;
  ratio: string;
  align: "left" | "right";
  offsetY?: string;
  overview: string;
  challenge: string;
  approach: string[];
  results: { value: string; label: string }[];
  services: string[];
  gallery: { src: string; caption?: string; tall?: boolean }[];
  quote: { text: string; author: string; role: string };
  nextSlug: string;
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "livenation",
    title: "LiveNation",
    subtitle: "Bold, Interactive Live Entertainment",
    client: "Live Nation Entertainment",
    year: "2024",
    industry: "Entertainment",
    tags: ["Concept", "Mobile First Design", "UX/UI"],
    hero: liveNation,
    ratio: "aspect-[16/10]",
    align: "left",
    overview:
      "Live Nation came to us with a mandate: rebuild the mobile concert discovery experience for a generation that lives on their phones. The result is a sensory, scroll-driven product that turns ticket browsing into anticipation.",
    challenge:
      "The legacy app treated every artist, venue and tour as a database row. Discovery felt like a search engine, not a night out. Conversion on mobile lagged desktop by 38% and average session time was under 90 seconds.",
    approach: [
      "Ran a four-week discovery sprint with fans, casual buyers and superfans across three markets.",
      "Built a new design system grounded in editorial typography and full-bleed artist imagery.",
      "Reimagined the artist page as a scrolling story — tour, setlist, merch, ticket — in a single thumb-driven flow.",
      "Prototyped 14 micro-interactions tied to checkout to make queueing feel intentional, not punitive.",
    ],
    results: [
      { value: "+62%", label: "Mobile conversion" },
      { value: "3.4×", label: "Session duration" },
      { value: "+41%", label: "Add-to-cart rate" },
      { value: "9.1/10", label: "App Store rating" },
    ],
    services: ["UX Research", "Product Design", "Design System", "Prototyping"],
    gallery: [
      { src: liveNation, caption: "Home — editorial hero with personalised tour feed", tall: false },
      { src: liveNation, caption: "Artist page scroll-through", tall: true },
      { src: liveNation, caption: "Ticket selection with queue state", tall: false },
      { src: liveNation, caption: "Post-purchase calendar handoff", tall: false },
    ],
    quote: {
      text: "StellR redesigned how we think about mobile discovery. Conversion is up, but more importantly, the product finally feels like Live Nation.",
      author: "Maya Chen",
      role: "VP Product, Live Nation Entertainment",
    },
    nextSlug: "upli",
  },
  {
    slug: "upli",
    title: "Upli",
    subtitle: "Financial Wellness at your Fingertips",
    client: "Upli Inc.",
    year: "2024",
    industry: "Fintech",
    tags: ["App UI Design", "Mobile App Strategy", "Mobile App Design"],
    hero: upli,
    ratio: "aspect-[9/11]",
    align: "right",
    offsetY: "md:mt-24",
    overview:
      "Upli is a financial wellness app for Gen Z workers paid hourly. We led product strategy and design from a blank Figma to launch across iOS and Android in 14 weeks.",
    challenge:
      "Most fintech UI is built for spreadsheet users. Upli's audience opens the app three times a day on the bus. We had to make budgeting feel as easy as Instagram, without dumbing down the math.",
    approach: [
      "Defined a four-screen 'flagship loop' — earn, spend, save, plan — that anchored the entire IA.",
      "Built a tactile motion language: every primary action has a haptic and a 240ms response.",
      "Co-designed an inclusive icon set with the Upli community across six paydays.",
      "Shipped a design system in Figma + tokens that the in-house team owns post-launch.",
    ],
    results: [
      { value: "180k", label: "Downloads in 90 days" },
      { value: "4.8★", label: "App Store rating" },
      { value: "67%", label: "Day-30 retention" },
      { value: "$2.1M", label: "Seed → Series A" },
    ],
    services: ["Mobile Strategy", "Product Design", "Design System", "Brand Motion"],
    gallery: [
      { src: upli, caption: "Onboarding — paycheck linking in three taps", tall: true },
      { src: upli, caption: "Home dashboard with weekly cashflow", tall: false },
      { src: upli, caption: "Savings goal flow", tall: true },
      { src: upli, caption: "Community paydays feed", tall: false },
    ],
    quote: {
      text: "We hired StellR for design and got a product partner. They wrote our App Store copy, our investor narrative, and our hiring brief for our first PM.",
      author: "Jordan Patel",
      role: "Co-founder & CEO, Upli",
    },
    nextSlug: "tilton",
  },
  {
    slug: "tilton",
    title: "Tilton School",
    subtitle: "Encouraging Enrollment through Authenticity",
    client: "Tilton School",
    year: "2023",
    industry: "Education",
    tags: ["Art Direction", "Communication Strategy", "Content Strategy"],
    hero: tilton,
    ratio: "aspect-[9/11]",
    align: "left",
    offsetY: "md:-mt-16",
    overview:
      "A 178-year-old New Hampshire boarding school was losing applicants to glossier brands. We led a top-to-bottom brand and site overhaul that traded stock photography for raw, student-led storytelling.",
    challenge:
      "Boarding-school marketing has become indistinguishable — sweater-vests, manicured lawns, drone shots of brick. Tilton's actual community is messier, funnier and more interesting, but the marketing didn't show it.",
    approach: [
      "Embedded on campus for ten days to film and photograph real student life.",
      "Rebuilt the website as an editorial publication, not a brochure.",
      "Wrote a new voice guide and trained the admissions team on it.",
      "Launched an Instagram-first 'A Day at Tilton' content engine the school runs in-house.",
    ],
    results: [
      { value: "+34%", label: "Applications" },
      { value: "+71%", label: "Tour requests" },
      { value: "5.1 min", label: "Avg. session time" },
      { value: "+22%", label: "Yield rate" },
    ],
    services: ["Brand Strategy", "Art Direction", "Web Design", "Content"],
    gallery: [
      { src: tilton, caption: "Editorial homepage — student photography front and centre", tall: false },
      { src: tilton, caption: "Academic program detail page", tall: true },
      { src: tilton, caption: "Day-in-the-life story template", tall: false },
      { src: tilton, caption: "Mobile apply flow", tall: true },
    ],
    quote: {
      text: "StellR helped us tell the truth about Tilton — and the truth turned out to be our best recruitment tool.",
      author: "Dr. Eleanor Marsh",
      role: "Head of School, Tilton",
    },
    nextSlug: "newscorp",
  },
  {
    slug: "newscorp",
    title: "News Corp",
    subtitle: "A Better Benefits Selection Experience",
    client: "News Corp",
    year: "2023",
    industry: "Enterprise / HR Tech",
    tags: ["Strategy", "Web Audit", "UX/UI"],
    hero: newscorp,
    ratio: "aspect-[16/11]",
    align: "right",
    offsetY: "md:mt-32",
    overview:
      "News Corp's annual benefits enrollment spanned 38,000 US employees across eight brands. The legacy portal generated 11,000 HR support tickets per cycle. We rebuilt the experience in eight months.",
    challenge:
      "Benefits selection is high-stakes, low-frequency, and emotionally exhausting. The existing portal treated it like an enterprise form. Employees were defaulting into the wrong plans and HR was drowning in calls.",
    approach: [
      "Mapped 47 employee personas across union, salaried, hourly and international workers.",
      "Designed a guided-decision flow that adapts to family status, salary band and prior elections.",
      "Built a plan-comparison engine with plain-language explanations vetted by legal and benefits SMEs.",
      "Shipped accessibility to WCAG 2.2 AA and ran usability tests with screen-reader users in week one.",
    ],
    results: [
      { value: "−68%", label: "HR support tickets" },
      { value: "94%", label: "Completion rate" },
      { value: "12 min", label: "Avg. enrollment time" },
      { value: "WCAG AA", label: "Accessibility" },
    ],
    services: ["UX Research", "Enterprise UX", "Design System", "Accessibility"],
    gallery: [
      { src: newscorp, caption: "Guided enrollment landing", tall: false },
      { src: newscorp, caption: "Plan comparison table", tall: false },
      { src: newscorp, caption: "Dependent management module", tall: true },
      { src: newscorp, caption: "Confirmation & summary", tall: false },
    ],
    quote: {
      text: "Cutting 68% of support tickets paid for the engagement in the first cycle. The team experience is the bigger win — open enrollment used to be the most-dreaded week at HR.",
      author: "Linda Reyes",
      role: "SVP People Operations, News Corp",
    },
    nextSlug: "livenation",
  },
];

export const getCaseStudy = (slug: string) =>
  CASE_STUDIES.find((c) => c.slug === slug);
