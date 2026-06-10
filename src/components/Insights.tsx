import { ArrowRight } from "lucide-react";

type Story = {
  title: string;
  tags: string[];
  image: string;
};

const STORIES: Story[] = [
  {
    title: "Fintech Companies Want Design Thinking",
    tags: ["UX AGENCY", "WEB DESIGN COMPANY", "WEB-DESIGN-AGENCIES"],
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80&auto=format&fit=crop",
  },
  {
    title: "The Importance of Iteration: Why Product Design Never Really Ends",
    tags: ["UX AGENCY", "WEB DESIGN COMPANY"],
    image:
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80&auto=format&fit=crop",
  },
  {
    title: "The Art of Transformative Rebranding",
    tags: ["BRANDING AGENCY", "DIGITAL TRANSFORMATION", "MARKETING STRATEGIES"],
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80&auto=format&fit=crop",
  },
];

export default function Insights() {
  return (
    <section className="relative z-10 bg-[#1a0533] px-6 py-28 md:px-12 lg:px-20">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="mb-16 font-serif text-[64px] font-normal leading-[1.05] tracking-tight text-white md:text-[88px] lg:text-[110px]">
          Insights and stories
        </h2>

        <div className="grid grid-cols-1 gap-px md:grid-cols-3">
          {STORIES.map((s) => (
            <article
              key={s.title}
              className="group relative flex flex-col border border-white/15 bg-transparent p-8 transition-colors duration-500 hover:bg-white"
            >
              <div className="mb-8 aspect-[16/9] w-full overflow-hidden">
                <img
                  src={s.image}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <h3 className="font-serif text-[26px] font-normal leading-[1.15] text-white transition-colors duration-500 group-hover:text-[#1a0033] md:text-[30px]">
                {s.title}
              </h3>

              <div className="mt-8 flex flex-col flex-wrap items-start gap-3">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center border border-white/30 px-4 py-2 text-[11px] font-medium tracking-[0.12em] text-white/90 transition-colors duration-500 group-hover:border-[#2a0a4a] group-hover:text-[#1a0033]"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <button
                aria-label="Read story"
                className="pointer-events-none absolute -right-7 bottom-10 flex h-14 w-14 translate-y-2 items-center justify-center rounded-full bg-[#a78bfa] text-white opacity-0 shadow-lg ring-4 ring-[#1a0533] transition-all duration-500 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
