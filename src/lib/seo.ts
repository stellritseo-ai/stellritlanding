export const SITE_URL = "https://www.stellrit.com";

export const COMPANY = {
  name: "StellR IT LLC",
  legalName: "StellR IT LLC",
  shortName: "StellR IT",
  url: SITE_URL,
  logo: `${SITE_URL}/fav.png`,
  ogImage: `${SITE_URL}/og-image.png`,
  telephone: "+12148380543",
  telephoneDisplay: "(214) 838-0543",
  tollFree: "+13254808108",
  tollFreeDisplay: "(325) 480-8108",
  email: "info@stellrit.com",
  address: {
    streetAddress: "5305 Creek CT",
    addressLocality: "Garland",
    addressRegion: "TX",
    postalCode: "75043",
    addressCountry: "US",
  },
  geo: {
    latitude: 32.9126,
    longitude: -96.6389,
  },
  sameAs: [
    "https://www.linkedin.com/company/stellrit",
    "https://www.facebook.com/stellrit",
    "https://www.instagram.com/stellrit",
    "https://www.youtube.com/@stellrit",
    "https://www.tiktok.com/@stellrit",
  ],
} as const;

export function toAbsoluteUrl(pathOrUrl?: string): string {
  if (!pathOrUrl) return COMPANY.ogImage;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const normalized = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_URL}${normalized}`;
}

export function canonicalUrl(path: string): string {
  if (!path || path === "/") return `${SITE_URL}/`;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${clean.replace(/\/+$/, "")}`;
}

export interface RouteHeadOptions {
  title: string;
  description: string;
  path: string;
  ogType?: "website" | "article";
  image?: string;
  imageAlt?: string;
  noindex?: boolean;
  twitterCard?: "summary_large_image" | "summary";
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  author?: string;
}

export function buildRouteHead({
  title,
  description,
  path,
  ogType = "website",
  image,
  imageAlt,
  noindex = false,
  twitterCard = "summary_large_image",
  publishedTime,
  modifiedTime,
  section,
  author,
}: RouteHeadOptions) {
  const url = canonicalUrl(path);
  const absImage = toAbsoluteUrl(image ?? COMPANY.ogImage);
  const altText = imageAlt ?? title;
  const robots = noindex
    ? "noindex, nofollow, noarchive"
    : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1";

  const meta: Array<Record<string, string>> = [
    { title },
    { name: "description", content: description },
    { name: "robots", content: robots },
    ...(author ? [{ name: "author", content: author }] : []),
    // Open Graph
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: ogType },
    { property: "og:url", content: url },
    { property: "og:site_name", content: COMPANY.name },
    { property: "og:locale", content: "en_US" },
    { property: "og:image", content: absImage },
    { property: "og:image:secure_url", content: absImage },
    { property: "og:image:alt", content: altText },
    // Twitter / X
    { name: "twitter:card", content: twitterCard },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: absImage },
    { name: "twitter:image:alt", content: altText },
  ];

  if (ogType === "article") {
    if (publishedTime) meta.push({ property: "article:published_time", content: publishedTime });
    if (modifiedTime) meta.push({ property: "article:modified_time", content: modifiedTime });
    if (section) meta.push({ property: "article:section", content: section });
  }

  return {
    meta,
    links: noindex ? [] : [{ rel: "canonical", href: url }],
  };
}

export function buildOrganizationGraphSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": `${SITE_URL}/#organization`,
        name: COMPANY.name,
        legalName: COMPANY.legalName,
        url: `${SITE_URL}/`,
        logo: {
          "@type": "ImageObject",
          "@id": `${SITE_URL}/#logo`,
          url: COMPANY.logo,
          width: 512,
          height: 512,
          caption: "StellR IT LLC Logo",
        },
        image: {
          "@type": "ImageObject",
          url: COMPANY.ogImage,
          width: 1200,
          height: 630,
        },
        description:
          "StellR IT LLC is a US-based AI development and custom software engineering company headquartered in Garland, Texas. We build custom AI applications, autonomous AI agents, RAG chatbots, SaaS platforms, web and mobile applications, and provide dedicated engineering teams worldwide.",
        telephone: COMPANY.telephone,
        email: COMPANY.email,
        address: {
          "@type": "PostalAddress",
          ...COMPANY.address,
        },
        geo: {
          "@type": "GeoCoordinates",
          ...COMPANY.geo,
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: COMPANY.telephone,
            contactType: "sales",
            availableLanguage: ["English"],
            areaServed: ["US", "CA", "GB", "AU"],
          },
          {
            "@type": "ContactPoint",
            telephone: COMPANY.tollFree,
            contactType: "customer service",
            availableLanguage: ["English"],
            areaServed: "Worldwide",
          },
          {
            "@type": "ContactPoint",
            email: COMPANY.email,
            contactType: "technical support",
            availableLanguage: ["English"],
            areaServed: "Worldwide",
          },
        ],
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "18:00",
          },
        ],
        areaServed: [
          { "@type": "City", name: "Garland" },
          { "@type": "City", name: "Dallas" },
          { "@type": "State", name: "Texas" },
          { "@type": "Country", name: "United States" },
          { "@type": "Country", name: "Canada" },
          { "@type": "Country", name: "United Kingdom" },
          { "@type": "Country", name: "Australia" },
        ],
        knowsAbout: [
          "Artificial Intelligence Development",
          "Generative AI Engineering",
          "Autonomous AI Agents",
          "AI Workflow Automation",
          "Retrieval-Augmented Generation (RAG)",
          "Large Language Model Integration",
          "Custom AI Chatbot Development",
          "Custom Software Development",
          "SaaS Product Architecture",
          "React and Next.js Web Development",
          "Mobile Application Development",
          "UX Research and Product Design",
          "Technical SEO and Conversion Rate Optimization",
          "Dedicated Software Engineering Teams",
        ],
        sameAs: [...COMPANY.sameAs],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "StellR IT LLC AI & Software Engineering Services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "AI Software Development",
                url: `${SITE_URL}/services/ai-software-development`,
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "AI Automation & Autonomous AI Agents",
                url: `${SITE_URL}/services/ai-automation-agents`,
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Custom AI Chatbot & RAG Development",
                url: `${SITE_URL}/services/ai-chatbot-development`,
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Custom Web & Software Development",
                url: `${SITE_URL}/services/web-development`,
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "SaaS Development",
                url: `${SITE_URL}/services/saas-development`,
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Mobile App Development",
                url: `${SITE_URL}/services/mobile-app-development`,
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Dedicated Engineering Teams",
                url: `${SITE_URL}/services/dedicated-teams`,
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "UX Research & Strategy",
                url: `${SITE_URL}/services/ux-research-strategy`,
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Web & Product Design",
                url: `${SITE_URL}/services/web-product-design`,
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Brand Identity Design",
                url: `${SITE_URL}/services/brand-identity`,
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Digital Marketing, SEO & CRO",
                url: `${SITE_URL}/services/digital-marketing`,
              },
            },
          ],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: COMPANY.name,
        description:
          "StellR IT LLC — AI development company and custom software engineering firm in Garland, Texas serving businesses across the United States and worldwide.",
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en-US",
      },
    ],
  };
}

export function buildBreadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}

export function buildWebPageSchema({
  type = "WebPage",
  name,
  description,
  path,
}: {
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
  name: string;
  description: string;
  path: string;
}) {
  const url = canonicalUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-US",
  };
}

export function buildFaqSchema(faqs: Array<{ q?: string; a?: string; question?: string; answer?: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q ?? faq.question ?? "",
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a ?? faq.answer ?? "",
      },
    })),
  };
}
