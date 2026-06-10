export default function ScrollBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#180028]">
      {/* GPU-accelerated ambient glows (no scroll listeners) */}
      <div
        className="absolute -top-[20%] -left-[10%] h-[70vh] w-[70vw] rounded-full opacity-[0.15] blur-[120px]"
        style={{
          background: "radial-gradient(circle, #a855f7 0%, transparent 70%)",
          transform: "translateZ(0)",
        }}
      />
      <div
        className="absolute top-[40%] -right-[20%] h-[80vh] w-[60vw] rounded-full opacity-[0.12] blur-[140px]"
        style={{
          background: "radial-gradient(circle, #ff8a5b 0%, transparent 70%)",
          transform: "translateZ(0)",
        }}
      />
      <div
        className="absolute -bottom-[20%] left-[20%] h-[60vh] w-[80vw] rounded-full opacity-[0.15] blur-[130px]"
        style={{
          background: "radial-gradient(circle, #3A0A7A 0%, transparent 70%)",
          transform: "translateZ(0)",
        }}
      />

      {/* Static Film grain */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "160px 160px",
          transform: "translateZ(0)",
        }}
      />
    </div>
  );
}
