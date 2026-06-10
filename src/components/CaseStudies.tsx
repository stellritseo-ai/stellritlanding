import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import liveNation from "@/assets/case-livenation.jpg";
import upli from "@/assets/case-upli.jpg";
import tilton from "@/assets/case-tilton.jpg";
import newscorp from "@/assets/case-newscorp.jpg";

type Study = {
  slug: string;
  title: string;
  subtitle: string;
  tags: string[];
  image: string;
  ratio: string;
  align: "left" | "right";
  offsetY?: string;
};

const STUDIES: Study[] = [
  {
    slug: "livenation",
    title: "LiveNation",
    subtitle: "Bold, Interactive Live Entertainment",
    tags: ["Concept", "Mobile First Design", "UX/UI"],
    image: liveNation,
    ratio: "aspect-[16/10]",
    align: "left",
  },
  {
    slug: "upli",
    title: "Upli",
    subtitle: "Financial Wellness at your Fingertips",
    tags: ["App UI Design", "Mobile App Strategy", "Mobile App Design"],
    image: upli,
    ratio: "aspect-[9/11]",
    align: "right",
    offsetY: "md:mt-24",
  },
  {
    slug: "tilton",
    title: "Tilton School",
    subtitle: "Encouraging Enrollment through Authenticity",
    tags: ["Art Direction", "Communication Strategy", "Content Strategy"],
    image: tilton,
    ratio: "aspect-[9/11]",
    align: "left",
    offsetY: "md:-mt-16",
  },
  {
    slug: "newscorp",
    title: "News Corp",
    subtitle: "A Better Benefits Selection Experience",
    tags: ["Strategy", "Web Audit", "UX/UI"],
    image: newscorp,
    ratio: "aspect-[16/11]",
    align: "right",
    offsetY: "md:mt-32",
  },
];

export default function CaseStudies() {
  return (
    <section className="relative z-10 py-28 md:py-36">
      <div className="mx-auto max-w-[1240px] px-6">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
          className="font-serif text-[56px] leading-none tracking-tight text-white md:text-[88px]"
        >
          Case studies
        </motion.h2>

        <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-20 md:mt-24 md:grid-cols-2 md:gap-y-8">
          {STUDIES.map((s, i) => (
            <CaseCard key={s.title} study={s} index={i} />
          ))}
        </div>

        <div className="mt-20 md:mt-28">
          <a
            href="#"
            className="inline-flex items-center rounded-full bg-[#7c3aed] px-7 py-3.5 text-sm font-medium text-white shadow-[0_10px_30px_-10px_rgba(124,58,237,0.6)] transition-all hover:-translate-y-0.5 hover:bg-[#8b5cf6]"
          >
            All Case Studies
          </a>
        </div>
      </div>
    </section>
  );
}

function CaseCard({ study, index }: { study: Study; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: index * 0.05, ease: [0.2, 0.7, 0.2, 1] }}
      className={`group ${study.offsetY ?? ""}`}
    >
      <div className={`overflow-hidden rounded-sm ${study.ratio} relative`}>
        <motion.img
          src={study.image}
          alt={study.title}
          loading="lazy"
          className="h-full w-full object-cover"
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
        />
      </div>
      <div className="mt-7">
        <h3 className="relative inline-block font-serif text-[34px] leading-tight text-white md:text-[40px]">
          {study.title}
          <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 bg-white/80 transition-transform duration-500 group-hover:scale-x-0" />
        </h3>
        <p className="mt-3 text-[15px] text-white/85">{study.subtitle}</p>
        <p className="mt-2 text-[12px] uppercase tracking-wider text-white/55">
          {study.tags.join("  —  ")}
        </p>
      </div>
    </motion.article>
  );
}
