import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import PageTransition from "@/components/PageTransition";
import NotFoundPage from "@/components/NotFoundPage";
import favImg from "@/assets/fav.png";
import MaintenanceModePage from "@/components/MaintenanceModePage";
import { getSiteConfigFn } from "@/lib/dashboard.functions.server";

function NotFoundComponent() {
  return <NotFoundPage />;
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: async ({ location }) => {
    // Bypass maintenance mode check for dashboard, login, and upload pages
    const isPublic = !["/dashboard", "/login", "/upload"].some(path =>
      location.pathname.startsWith(path)
    );
    if (!isPublic) return { maintenance: false };

    try {
      const config = await getSiteConfigFn();
      return {
        maintenance: config?.maintenanceMode ?? false,
      };
    } catch (err) {
      console.error("Failed to load maintenance configuration:", err);
      return { maintenance: false };
    }
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        title:
          "StellR IT LLC — AI Development Company | Software Development | Digital Transformation",
      },
      {
        name: "description",
        content:
          "StellR IT LLC is a leading AI development company and custom software development firm. We build AI software, generative AI, chatbots, automation systems, SaaS platforms, web & mobile apps, and deliver dedicated engineering teams for startups to enterprises worldwide.",
      },
      {
        name: "keywords",
        content:
          "AI development company, AI software development, generative AI development, AI chatbot development, AI automation company, LLM integration, custom AI solutions, software development company, custom software development, SaaS development, web development company, mobile app development, React development, Next.js development, Flutter development, dedicated development team, dedicated AI engineers, remote development team, offshore development company, white label development, staff augmentation, IT outsourcing, digital transformation company, enterprise software development, healthcare AI development, dental AI solutions, AI consulting, business process automation, AI workflow automation, RAG development, vector database, knowledge base AI, AI CRM, AI voice agent, conversational AI, OpenAI integration, Claude AI integration, Gemini AI integration, SEO company, digital marketing agency, web design company, Garland TX software company, Texas AI company",
      },
      { name: "author", content: "StellR IT LLC" },
      { name: "robots", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
      { name: "theme-color", content: "#180028" },
      { name: "application-name", content: "StellR IT LLC" },
      { name: "generator", content: "StellR IT LLC Engineering" },
      { name: "rating", content: "general" },
      { name: "language", content: "English" },
      { name: "revisit-after", content: "7 days" },
      // Geo meta tags

      { name: "geo.region", content: "US-TX" },
      { name: "geo.placename", content: "Garland, Texas" },
      { name: "geo.position", content: "32.9126;-96.6389" },
      { name: "ICBM", content: "32.9126, -96.6389" },
      // Open Graph
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "StellR IT LLC" },
      {
        property: "og:title",
        content:
          "StellR IT LLC — AI Development Company | Software Development | Digital Transformation",
      },
      {
        property: "og:description",
        content:
          "Leading AI development, custom software engineering, SaaS, mobile apps & digital transformation. Dedicated remote engineering teams for agencies and enterprises worldwide. Based in Garland, TX.",
      },
      { property: "og:url", content: "https://stellrit.com" },
      { property: "og:image", content: "https://stellrit.com/og-image.png" },
      { property: "og:image:secure_url", content: "https://stellrit.com/og-image.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:alt", content: "StellR IT LLC — AI Development & Software Engineering Company" },
      { property: "og:locale", content: "en_US" },
      { property: "og:locale:alternate", content: "en_GB" },
      { property: "og:locale:alternate", content: "en_AU" },
      { property: "og:locale:alternate", content: "en_CA" },
      { property: "article:publisher", content: "https://www.linkedin.com/company/stellrit" },
      // Twitter / X
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@StellRIT" },
      { name: "twitter:creator", content: "@StellRIT" },
      {
        name: "twitter:title",
        content: "StellR IT LLC — AI Development Company | Software Development",
      },
      {
        name: "twitter:description",
        content:
          "Leading AI development, software engineering, SaaS & digital transformation. Dedicated remote teams for agencies & enterprises worldwide.",
      },
      { name: "twitter:image", content: "https://stellrit.com/og-image.png" },
      { name: "twitter:image:alt", content: "StellR IT LLC — AI & Software Development Company" },
    ],
    links: [
      { rel: "icon", href: "/fav.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/fav.png" },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "canonical", href: "https://stellrit.com" },
      { rel: "stylesheet", href: appCss },
      // DNS prefetch for performance
      { rel: "dns-prefetch", href: "https://fonts.googleapis.com" },
      { rel: "dns-prefetch", href: "https://fonts.gstatic.com" },
      { rel: "dns-prefetch", href: "https://images.unsplash.com" },
      // Preconnect for critical resources
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,300;1,400&family=Inter:wght@400;500;600&display=swap",
      },
      // hreflang for international SEO
      { rel: "alternate", hrefLang: "en", href: "https://stellrit.com/" },
      { rel: "alternate", hrefLang: "en-US", href: "https://stellrit.com/" },
      { rel: "alternate", hrefLang: "en-GB", href: "https://stellrit.com/" },
      { rel: "alternate", hrefLang: "en-AU", href: "https://stellrit.com/" },
      { rel: "alternate", hrefLang: "en-CA", href: "https://stellrit.com/" },
      { rel: "alternate", hrefLang: "x-default", href: "https://stellrit.com/" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  // Global Organization schema — applies to every page
  const orgSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": "https://stellrit.com/#organization",
        name: "StellR IT LLC",
        legalName: "StellR IT LLC",
        url: "https://stellrit.com",
        logo: {
          "@type": "ImageObject",
          "@id": "https://stellrit.com/#logo",
          url: "https://stellrit.com/fav.png",
          width: 512,
          height: 512,
          caption: "StellR IT LLC Logo",
        },
        image: {
          "@type": "ImageObject",
          url: "https://stellrit.com/og-image.png",
          width: 1200,
          height: 630,
        },
        description:
          "StellR IT LLC is a leading AI development company and custom software engineering firm. We build AI software, generative AI applications, chatbots, automation systems, SaaS platforms, web and mobile apps, and provide dedicated engineering teams for startups to enterprises worldwide.",
        slogan: "Build Smarter. Scale Faster. Lead with AI.",
        telephone: "+12148380543",
        email: "info@stellrit.com",
        address: {
          "@type": "PostalAddress",
          streetAddress: "5305 Creek CT",
          addressLocality: "Garland",
          addressRegion: "TX",
          postalCode: "75043",
          addressCountry: "US",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 32.9126,
          longitude: -96.6389,
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: "+12148380543",
            contactType: "sales",
            availableLanguage: ["English"],
            areaServed: "Worldwide",
          },
          {
            "@type": "ContactPoint",
            telephone: "+13254808108",
            contactType: "customer service",
            availableLanguage: ["English"],
            areaServed: "Worldwide",
          },
          {
            "@type": "ContactPoint",
            email: "info@stellrit.com",
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
          // United States
          { "@type": "State", name: "Texas" },
          { "@type": "City", name: "New York" },
          { "@type": "State", name: "California" },
          { "@type": "State", name: "Florida" },
          { "@type": "State", name: "North Carolina" },
          { "@type": "State", name: "Virginia" },
          { "@type": "State", name: "Washington" },
          { "@type": "State", name: "Illinois" },
          { "@type": "State", name: "Georgia" },
          { "@type": "State", name: "Colorado" },
          { "@type": "State", name: "Massachusetts" },
          { "@type": "Country", name: "United States" },
          // Canada
          { "@type": "City", name: "Toronto" },
          { "@type": "City", name: "Vancouver" },
          { "@type": "Country", name: "Canada" },
          // United Kingdom
          { "@type": "City", name: "London" },
          { "@type": "City", name: "Manchester" },
          { "@type": "Country", name: "United Kingdom" },
          // Australia
          { "@type": "City", name: "Sydney" },
          { "@type": "City", name: "Melbourne" },
          { "@type": "Country", name: "Australia" },
          // Europe
          { "@type": "Country", name: "Germany" },
          { "@type": "Country", name: "Netherlands" },
          { "@type": "Country", name: "Ireland" },
          // Middle East
          { "@type": "City", name: "Dubai" },
          { "@type": "Country", name: "United Arab Emirates" },
          { "@type": "Country", name: "Saudi Arabia" },
          // Asia
          { "@type": "City", name: "Singapore" },
          { "@type": "Country", name: "India" },
          { "@type": "Country", name: "Nepal" },
        ],
        priceRange: "$$",
        foundingDate: "2020",
        numberOfEmployees: { "@type": "QuantitativeValue", value: "50+" },
        knowsAbout: [
          "Artificial Intelligence Development",
          "Generative AI",
          "Large Language Models",
          "Machine Learning",
          "Custom Software Development",
          "SaaS Development",
          "Web Development",
          "Mobile App Development",
          "React Development",
          "Next.js Development",
          "Flutter Development",
          "AI Automation",
          "Business Process Automation",
          "RAG Implementation",
          "AI Chatbot Development",
          "Healthcare AI",
          "Digital Transformation",
          "Cloud Computing",
          "API Development",
          "DevOps",
          "SEO",
          "Digital Marketing",
          "Dedicated Engineering Teams",
          "Staff Augmentation",
          "IT Outsourcing",
        ],
        sameAs: [
          "https://twitter.com/StellRIT",
          "https://www.linkedin.com/company/stellrit",
          "https://www.facebook.com/stellrit",
          "https://www.instagram.com/stellrit",
          "https://clutch.co/profile/stellr-it",
          "https://www.goodfirms.co/company/stellr-it",
          "https://www.designrush.com/agency/profile/stellr-it",
          "https://upcity.com/company/stellr-it",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "AI, Software & Digital Services",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI Software Development", url: "https://stellrit.com/services" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Generative AI Development", url: "https://stellrit.com/services" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI Chatbot Development", url: "https://stellrit.com/services" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI Voice Agent Development", url: "https://stellrit.com/services" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI Automation", url: "https://stellrit.com/services" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "LLM Integration", url: "https://stellrit.com/services" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "RAG Development", url: "https://stellrit.com/services" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Custom Software Development", url: "https://stellrit.com/services" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "SaaS Development", url: "https://stellrit.com/services" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Web Development", url: "https://stellrit.com/services" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Mobile App Development", url: "https://stellrit.com/services" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Dedicated Engineering Team", url: "https://stellrit.com/services" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Digital Marketing", url: "https://stellrit.com/services" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "SEO Services", url: "https://stellrit.com/services" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Healthcare AI Solutions", url: "https://stellrit.com/services" } },
          ],
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://stellrit.com/#website",
        url: "https://stellrit.com",
        name: "StellR IT LLC",
        description:
          "AI development company and custom software engineering firm serving startups to enterprises worldwide.",
        publisher: { "@id": "https://stellrit.com/#organization" },
        inLanguage: "en-US",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://stellrit.com/?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NVSV2BZN');`,
          }}
        />
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body>
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NVSV2BZN"
height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          }}
        />
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const { maintenance } = Route.useLoaderData() as { maintenance: boolean };

  if (maintenance) {
    return (
      <QueryClientProvider client={queryClient}>
        <MaintenanceModePage onRefresh={() => window.location.reload()} />
        <Toaster position="bottom-right" richColors />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <PageTransition>
        <Outlet />
      </PageTransition>
      <Toaster position="bottom-right" richColors />
    </QueryClientProvider>
  );
}
