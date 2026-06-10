import { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, useVelocity } from "framer-motion";
import { ArrowUpRight, LayoutGrid, List } from "lucide-react";
import brandImg from "@/assets/service-brand.jpg";
import productImg from "@/assets/service-product.jpg";
import liveNationImg from "@/assets/case-livenation.jpg";

type PortfolioItem = {
  title: string;
  category: "Branding" | "Digital Product" | "Creative Dev";
  description: string;
  image: string;
  year: string;
  tags: string[];
  accentColor: string;
  glowColor: string;
  ratio: string;
};

const CATEGORIES = ["All", "Branding", "Digital Product", "Creative Dev"] as const;
type Category = typeof CATEGORIES[number];

const ITEMS: PortfolioItem[] = [
  {
    title: "Aura Visual System",
    category: "Branding",
    description: "Reimagining identity for a next-generation decentralized cloud platform.",
    image: brandImg,
    year: "'26",
    tags: ["Brand Identity", "Visual System", "3D Motion"],
    accentColor: "#a855f7",
    glowColor: "rgba(168, 85, 247, 0.12)",
    ratio: "aspect-[4/5]",
  },
  {
    title: "Nova Portal",
    category: "Digital Product",
    description: "Designing a high-fidelity interface for automated smart contracts.",
    image: productImg,
    year: "'26",
    tags: ["UI/UX Design", "SaaS Interface", "React"],
    accentColor: "#ff8a5b",
    glowColor: "rgba(255, 138, 91, 0.1)",
    ratio: "aspect-[4/5]",
  },
  {
    title: "Spatial Soundscape",
    category: "Creative Dev",
    description: "An immersive audio-reactive spatial web landing experience.",
    image: liveNationImg,
    year: "'26",
    tags: ["Creative Dev", "WebGL", "Interactive Design"],
    accentColor: "#38bdf8",
    glowColor: "rgba(56, 189, 248, 0.1)",
    ratio: "aspect-[4/5]",
  },
];

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [layoutMode, setLayoutMode] = useState<"grid" | "list">("list");

  const listRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // List view mouse coordinates
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  // Velocity of list mouse coordinates for rotational inertia/skew
  const cursorXVelocity = useVelocity(cursorX);
  const cursorYVelocity = useVelocity(cursorY);

  // Smooth springs for list floating image follower position
  const springX = useSpring(cursorX, { stiffness: 180, damping: 22 });
  const springY = useSpring(cursorY, { stiffness: 180, damping: 22 });

  // Map velocity to rotation and skew for dynamic inertia effects on float image
  const rotateVal = useTransform(cursorXVelocity, [-3000, 3000], [-12, 12]);
  const skewXVal = useTransform(cursorYVelocity, [-3000, 3000], [-5, 5]);

  const springRotate = useSpring(rotateVal, { stiffness: 150, damping: 25 });
  const springSkewX = useSpring(skewXVal, { stiffness: 150, damping: 25 });

  const handleListMouseMove = (e: React.MouseEvent) => {
    const container = listRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const xVal = e.clientX - rect.left;
    const yVal = e.clientY - rect.top;
    
    cursorX.set(xVal);
    cursorY.set(yVal);
  };

  const filteredItems = ITEMS.filter(
    (item) => selectedCategory === "All" || item.category === selectedCategory
  );

  return (
    <section className="relative z-10 py-[70px] overflow-hidden bg-[#070314]/20">
      {/* Background ambient radial glows */}
      <div 
        className="pointer-events-none absolute left-1/3 top-1/4 h-[700px] w-[700px] rounded-full opacity-25"
        style={{
          background: "radial-gradient(circle, rgba(168,85,247,0.1), transparent 70%)",
          filter: "blur(90px)",
        }}
      />
      <div 
        className="pointer-events-none absolute right-1/4 bottom-1/4 h-[600px] w-[600px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(255,138,91,0.08), transparent 70%)",
          filter: "blur(95px)",
        }}
      />

      <div className="mx-auto max-w-[1300px] px-6">
        
        {/* Section Header */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between mb-16">
          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.5em] text-[#ff8a5b] font-medium mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff8a5b]" />
              Creative Laboratory
            </span>
            <h2 className="font-serif text-[28px] sm:text-[34px] md:text-[46px] lg:text-[52px] leading-tight tracking-tight text-white whitespace-nowrap">
              Experiments & <span className="text-white/40 italic font-normal">brand concepts.</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-4 self-start lg:self-end">
            {/* Apple-style Filter Dock */}
            <div className="p-1 bg-[#171127]/60 border border-white/[0.04] backdrop-blur-xl rounded-full flex gap-1">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`relative px-5 py-2.5 rounded-full text-[12px] font-medium transition-colors duration-300 cursor-pointer ${
                      isActive ? "text-white" : "text-white/45 hover:text-white/80"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeFilterPill"
                        className="absolute inset-0 rounded-full bg-white/[0.06] border border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{cat}</span>
                  </button>
                );
              })}
            </div>

            {/* Layout Mode Switcher */}
            <div className="p-1 bg-[#171127]/60 border border-white/[0.04] backdrop-blur-xl rounded-full flex gap-1">
              <button
                onClick={() => setLayoutMode("grid")}
                className={`relative p-2.5 rounded-full transition-colors duration-300 cursor-pointer ${
                  layoutMode === "grid" ? "text-white" : "text-white/45 hover:text-white/80"
                }`}
                title="Grid View"
              >
                {layoutMode === "grid" && (
                  <motion.div
                    layoutId="activeLayoutPill"
                    className="absolute inset-0 rounded-full bg-white/[0.06] border border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <LayoutGrid className="relative z-10 h-4.5 w-4.5" />
              </button>
              <button
                onClick={() => setLayoutMode("list")}
                className={`relative p-2.5 rounded-full transition-colors duration-300 cursor-pointer ${
                  layoutMode === "list" ? "text-white" : "text-white/45 hover:text-white/80"
                }`}
                title="List View"
              >
                {layoutMode === "list" && (
                  <motion.div
                    layoutId="activeLayoutPill"
                    className="absolute inset-0 rounded-full bg-white/[0.06] border border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <List className="relative z-10 h-4.5 w-4.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="relative overflow-visible min-h-[400px]">
          <AnimatePresence mode="wait">
            {layoutMode === "grid" ? (
              <motion.div
                key="grid-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
              >
                <AnimatePresence mode="popLayout">
                  {filteredItems.map((item) => (
                    <PortfolioCard key={item.title} item={item} />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="list-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                ref={listRef}
                onMouseMove={handleListMouseMove}
                className="relative flex flex-col w-full border-t border-white/[0.06] mt-4"
              >
                {filteredItems.map((item, idx) => (
                  <PortfolioListItem
                    key={item.title}
                    item={item}
                    idx={idx}
                    hoveredIndex={hoveredIndex}
                    setHoveredIndex={setHoveredIndex}
                  />
                ))}

                {/* Floating Follow Image Portal */}
                <AnimatePresence>
                  {hoveredIndex !== null && (
                    <motion.div
                      className="pointer-events-none absolute z-50 h-[280px] w-[200px] md:h-[340px] md:w-[250px] rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.6)] bg-black"
                      style={{
                        left: springX,
                        top: springY,
                        x: "-50%",
                        y: "-50%",
                        rotate: springRotate,
                        skewX: springSkewX,
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {filteredItems.map((item, i) => (
                        <motion.img
                          key={item.title}
                          src={item.image}
                          alt={item.title}
                          className="absolute inset-0 h-full w-full object-cover"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: hoveredIndex === i ? 1 : 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}

function PortfolioCard({ item }: { item: PortfolioItem }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for 3D rotation (max 10 degrees tilt)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 20 });

  // Inverted parallax shift for the image
  const imgX = useSpring(useTransform(mouseX, [-0.5, 0.5], [12, -12]), { stiffness: 150, damping: 20 });
  const imgY = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Normalize coordinates between -0.5 and 0.5
    const xVal = (e.clientX - rect.left) / width - 0.5;
    const yVal = (e.clientY - rect.top) / height - 0.5;
    
    mouseX.set(xVal);
    mouseY.set(yVal);
    
    // Custom properties for spotlight position
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        rotateX: rotateX,
        rotateY: rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
        boxShadow: isHovered
          ? `0 20px 40px rgba(0, 0, 0, 0.5), 0 0 50px ${item.glowColor}`
          : "0 10px 30px rgba(0, 0, 0, 0.3)",
      }}
      className={`group relative overflow-hidden rounded-3xl border border-white/[0.06] bg-[#0c061d] ${item.ratio} transition-all duration-300 ease-out cursor-pointer`}
    >
      {/* 3D Inner Layer */}
      <div 
        className="absolute inset-0 z-20 flex flex-col justify-between p-6 pointer-events-none"
        style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
      >
        {/* Top Header */}
        <div 
          className="flex justify-between items-center w-full"
          style={{ transform: "translateZ(15px)" }}
        >
          <span className="text-[10px] tracking-wider uppercase font-semibold text-white bg-[#0f0a20]/80 border border-white/[0.08] backdrop-blur-md px-3 py-1 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
            {item.category}
          </span>
          <span className="text-[10px] tracking-wider uppercase font-bold text-white/45 bg-[#0f0a20]/80 border border-white/[0.08] backdrop-blur-md px-2.5 py-1 rounded-full font-mono shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
            {item.year}
          </span>
        </div>

        {/* Arrow Button Overlay */}
        <div 
          className="absolute top-6 right-6 h-10 w-10 rounded-full border border-white/15 flex items-center justify-center text-white transition-all duration-500 ease-out backdrop-blur-md scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100"
          style={{
            transform: "translateZ(25px)",
            borderColor: `${item.accentColor}50`,
            background: `${item.accentColor}25`,
          }}
        >
          <ArrowUpRight className="h-4.5 w-4.5 group-hover:rotate-45 transition-transform duration-300" />
        </div>

        {/* Bottom Details */}
        <div 
          className="flex flex-col mt-auto w-full"
          style={{ transform: "translateZ(20px)" }}
        >
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {item.tags.map((tag) => (
              <span key={tag} className="text-[9px] uppercase tracking-widest text-white/40">
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className="font-serif text-[24px] md:text-[28px] leading-tight text-white tracking-tight flex items-center gap-2 group-hover:text-white/95 transition-colors duration-300">
            {item.title}
            <span 
              className="w-1.5 h-1.5 rounded-full transition-transform duration-500 origin-center scale-75 group-hover:scale-125"
              style={{ background: item.accentColor }}
            />
          </h3>

          {/* Description reveal wrapper */}
          <div className="h-0 opacity-0 overflow-hidden transition-all duration-500 ease-out group-hover:h-[45px] group-hover:opacity-100 group-hover:mt-2">
            <p className="text-[12px] leading-relaxed text-white/60 font-medium">
              {item.description}
            </p>
          </div>
        </div>
      </div>

      {/* Spotlight dynamic follow overlay */}
      <div
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 h-[320px] w-[320px] rounded-full opacity-0 transition-opacity duration-500 ease-out blur-[40px] group-hover:opacity-100 z-10"
        style={{
          left: "var(--mouse-x, 0px)",
          top: "var(--mouse-y, 0px)",
          background: `radial-gradient(circle, ${item.glowColor} 0%, rgba(255,255,255,0.01) 60%, transparent 100%)`,
        }}
      />

      {/* Dynamic vignette border */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#070314]/95 via-[#070314]/20 to-transparent opacity-85 z-10 transition-opacity duration-300 group-hover:opacity-95" />

      {/* Card Image */}
      <motion.img
        src={item.image}
        alt={item.title}
        style={{
          x: imgX,
          y: imgY,
          scale: 1.12,
          transform: "translateZ(-10px)",
        }}
        className="absolute inset-0 h-full w-full object-cover select-none pointer-events-none"
      />
    </motion.div>
  );
}

interface PortfolioListItemProps {
  item: PortfolioItem;
  idx: number;
  hoveredIndex: number | null;
  setHoveredIndex: (idx: number | null) => void;
}

function PortfolioListItem({ item, idx, hoveredIndex, setHoveredIndex }: PortfolioListItemProps) {
  const isHovered = hoveredIndex === idx;
  const isAnyHovered = hoveredIndex !== null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: isAnyHovered && !isHovered ? 0.35 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHoveredIndex(idx)}
      onMouseLeave={() => setHoveredIndex(null)}
      className="group relative flex flex-col md:flex-row md:items-center justify-between py-8 border-b border-white/[0.06] transition-all duration-300 cursor-pointer overflow-hidden px-4 -mx-4 rounded-xl"
    >
      {/* Sliding Glassy Background Overlay */}
      <div className="absolute inset-0 bg-white/[0.01] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out -z-10" />

      {/* Left Column: Index & Category */}
      <div className="flex items-center gap-6 md:gap-12 mb-3 md:mb-0">
        <span className="font-mono text-[13px] tracking-tight text-white/30 group-hover:text-white transition-colors duration-300">
          {(idx + 1).toString().padStart(2, "0")}
        </span>
        <span className="text-[11px] uppercase tracking-wider font-semibold text-[#ff8a5b] bg-[#ff8a5b]/10 border border-[#ff8a5b]/20 px-3 py-1 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
          {item.category}
        </span>
      </div>

      {/* Middle Column: Title & Tags */}
      <div className="flex-1 md:px-12 flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between">
        <h3 className="font-serif text-[28px] md:text-[34px] leading-tight text-white tracking-tight group-hover:translate-x-2 transition-transform duration-500 ease-out">
          {item.title}
        </h3>
        <div className="flex flex-wrap gap-2 md:opacity-50 group-hover:opacity-100 transition-opacity duration-300">
          {item.tags.map((tag) => (
            <span key={tag} className="text-[10px] uppercase tracking-widest text-white/50 border border-white/[0.06] px-2.5 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Right Column: Year & Action */}
      <div className="flex items-center gap-6 mt-4 md:mt-0 justify-between md:justify-end">
        <span className="font-mono text-[13px] text-white/40 group-hover:text-white/80 transition-colors duration-300">
          {item.year === "'26" ? "2026" : "2025"}
        </span>
        <div className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 transition-all duration-500 ease-out group-hover:text-white group-hover:bg-white/10 group-hover:border-white/20 group-hover:rotate-45">
          <ArrowUpRight className="h-4.5 w-4.5" />
        </div>
      </div>
    </motion.div>
  );
}
