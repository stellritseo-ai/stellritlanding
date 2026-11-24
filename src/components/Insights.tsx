import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { INSIGHT_ARTICLES } from "@/data/insights";

export default function Insights({
  className = "py-28",
}: {
  className?: string;
}) {
  const featuredStories = INSIGHT_ARTICLES.slice(0, 3);

  return (
    <section className={`relative z-10 px-6 md:px-12 lg:px-20 ${className}`}>
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-serif text-[48px] font-normal leading-[1.05] tracking-tight text-white md:text-[64px] lg:text-[80px]">
            Insights and stories
          </h2>
          <Link
            to="/insights"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/70 hover:text-white transition-colors"
          >
            All Insights <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-px lg:grid-cols-[2fr_1fr_1fr]">
          {featuredStories.map((s, idx) => {
            const isFeatured = idx === 0;
            return (
              <Link
                key={s.slug}
                to="/insights/$slug"
                params={{ slug: s.slug }}
                className={`group relative flex flex-col border border-white/15 bg-transparent transition-colors duration-500 hover:bg-white ${
                  isFeatured ? "justify-between p-10 md:p-14 lg:p-16" : "p-8"
                }`}
              >
                {!isFeatured && s.image && (
                  <div className="mb-8 aspect-[16/9] w-full overflow-hidden">
                    <img
                      src={s.image}
                      alt={s.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                )}

                <h3
                  className={`font-serif font-normal leading-[1.05] tracking-tight text-white transition-colors duration-500 group-hover:text-[#1a0033] ${
                    isFeatured
                      ? "text-[42px] md:text-[56px] lg:text-[64px]"
                      : "text-[26px] leading-[1.15] md:text-[30px]"
                  }`}
                >
                  {s.title}
                </h3>

                <div
                  className={`mt-10 flex gap-3 ${
                    isFeatured ? "flex-wrap" : "flex-col flex-wrap items-start"
                  }`}
                >
                  {s.tags.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center border border-white/30 px-4 py-2 text-[11px] font-medium tracking-[0.12em] text-white/90 transition-colors duration-500 group-hover:border-[#2a0a4a] group-hover:text-[#1a0033]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-7 bottom-10 flex h-14 w-14 translate-y-2 items-center justify-center rounded-full bg-[#a78bfa] text-white opacity-0 shadow-lg ring-4 ring-[#1a0533] transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 md:bottom-14"
                >
                  <ArrowRight className="h-5 w-5" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
