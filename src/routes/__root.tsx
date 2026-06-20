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
      { title: "StellR IT LLC — Custom Software Development & Digital Agency" },
      {
        name: "description",
        content:
          "StellR IT LLC is a custom software development company and digital agency in Garland, TX. We deliver enterprise web applications, SaaS development, AI automation, UX design, and digital marketing services.",
      },
      { name: "author", content: "StellR IT LLC" },
      {
        name: "keywords",
        content:
          "custom software development company, enterprise software development services, software outsourcing company, saas development agency, custom web application development services, software engineer consulting, api development, microservices architecture, mvp development, cloud migration services, devops consulting, rag implementation, ai agents, generative ai development, digital agency garland tx, web design company texas, ux design agency, brand identity design, digital transformation company",
      },
      { name: "robots", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
      { name: "theme-color", content: "#180028" },
      // Open Graph
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "StellR IT LLC" },
      { property: "og:title", content: "StellR IT LLC — Custom Software Development & Digital Agency" },
      {
        property: "og:description",
        content:
          "Enterprise software development, SaaS platforms, AI automation, and premium digital experiences. Based in Garland, TX — serving clients worldwide.",
      },
      { property: "og:url", content: "https://stellrit.com" },
      { property: "og:image", content: "https://stellrit.com/og-image.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:locale", content: "en_US" },
      // Twitter
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@StellRIT" },
      { name: "twitter:creator", content: "@StellRIT" },
      { name: "twitter:title", content: "StellR IT LLC — Custom Software Development & Digital Agency" },
      {
        name: "twitter:description",
        content:
          "Enterprise software development, SaaS platforms, AI automation & premium digital experiences. Garland, TX.",
      },
      { name: "twitter:image", content: "https://stellrit.com/og-image.png" },
    ],
    links: [
      { rel: "icon", href: "/fav.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/fav.png" },
      { rel: "canonical", href: "https://stellrit.com" },
      { rel: "stylesheet", href: appCss },
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
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
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
