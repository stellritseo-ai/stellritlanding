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
import { buildOrganizationGraphSchema, COMPANY } from "@/lib/seo";
import { trackAiReferralOnce } from "@/lib/analytics";

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
          "StellR IT LLC — AI Development & Custom Software Engineering Company | Garland, TX",
      },
      {
        name: "description",
        content:
          "StellR IT LLC is a US-based AI development and custom software engineering company in Garland, Texas. We build custom AI applications, autonomous agents, RAG chatbots, SaaS platforms, web & mobile apps, and dedicated engineering teams.",
      },
      { name: "author", content: COMPANY.name },
      { name: "theme-color", content: "#180028" },
      { name: "application-name", content: COMPANY.name },
      { name: "geo.region", content: "US-TX" },
      { name: "geo.placename", content: "Garland, Texas" },
      { name: "geo.position", content: "32.9126;-96.6389" },
      { name: "ICBM", content: "32.9126, -96.6389" },
      { property: "og:site_name", content: COMPANY.name },
      { property: "og:locale", content: "en_US" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:type", content: "image/png" },
    ],
    links: [
      { rel: "icon", href: "/fav.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/fav.png" },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "stylesheet", href: appCss },
      // DNS prefetch & preconnect for critical resources
      { rel: "dns-prefetch", href: "https://fonts.googleapis.com" },
      { rel: "dns-prefetch", href: "https://fonts.gstatic.com" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,300;1,400&family=Inter:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const orgSchema = buildOrganizationGraphSchema();

  return (
    <html lang="en-US">
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

  useEffect(() => {
    trackAiReferralOnce();
  }, []);

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
