import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function PageHero({
  eyebrow,
  title,
  description,
  children,
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={`relative min-h-[40vh] flex flex-col justify-center overflow-hidden bg-[#180028] text-white pt-24 pb-16 md:pt-32 md:pb-24 ${className}`}>
      {/* Background SVGs */}
      <div className="absolute inset-0 z-0 pointer-events-none mix-blend-screen">

        {/* SVG 1 - Top Left Circle */}
        <div className="absolute -top-[10%] -left-[10%] w-[50%] min-w-[400px] max-w-[700px] opacity-80">
          <svg width="665" height="665" viewBox="0 0 665 665" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <circle cx="332.285" cy="332.285" r="332.285" transform="matrix(-0.866025 -0.5 -0.5 0.866025 786.488 210.816)" fill="url(#gradient2)"></circle>
            <defs>
              <linearGradient id="gradient2" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#8E5CC0">
                  <animate attributeName="stop-color" values="#8E5CC0; transparent;  #8E5CC0" dur="10s" repeatCount="indefinite"></animate>
                </stop>
                <stop offset="100%" stopColor="transparent">
                  <animate attributeName="stop-color" values="transparent; #8E5CC0;  transparent" dur="10s" repeatCount="indefinite"></animate>
                </stop>
                <animateTransform attributeName="gradientTransform" type="rotate" from="0 .5 .5" to="0 .5 .5" dur="10s" repeatCount="indefinite"></animateTransform>
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* SVG 4 - Mid Left Circle */}
        <div className="absolute top-[40%] -left-[5%] w-[30%] min-w-[200px] max-w-[400px] opacity-70">
          <svg width="294" height="294" viewBox="0 0 294 294" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <circle cx="146.676" cy="146.676" r="146.676" transform="matrix(-0.866025 -0.5 -0.5 0.866025 347.326 93.6133)" fill="url(#gradient4)" fillOpacity="0.5"></circle>
            <defs>
              <linearGradient id="gradient4" x1="286.099" y1="95.3143" x2="-27.3396" y2="155.732" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#8E5CC0">
                  <animate attributeName="stop-color" values="#8E5CC0; transparent;  #8E5CC0" dur="10s" repeatCount="indefinite"></animate>
                </stop>
                <stop offset="100%" stopColor="transparent">
                  <animate attributeName="stop-color" values="transparent; #8E5CC0;  transparent" dur="10s" repeatCount="indefinite"></animate>
                </stop>
                <animateTransform attributeName="gradientTransform" type="rotate" from="0 .5 .5" to="0 .5 .5" dur="10s" repeatCount="indefinite"></animateTransform>
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* SVG 5 - Top Right Rounded Rect */}
        <div className="absolute top-[10%] right-[15%] w-[15%] min-w-[150px] max-w-[250px] opacity-60">
          <svg width="173" height="173" viewBox="0 0 173 173" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <rect width="172" height="172" rx="86" transform="matrix(0.866025 0.5 0.5 -0.866025 -31.3096 118.428)" fill="url(#pattern5)"></rect>
            <defs>
              <linearGradient id="pattern5" x1="1080.03" y1="210.887" x2="0.929331" y2="210.887" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#8052CD">
                  <animate attributeName="stop-color" values="#8052CD; #D15A8A; #8054DC; #BD6C95; #E09050; #9172B9; #695FE4; #8052CD" dur="10s" repeatCount="indefinite"></animate>
                </stop>
                <stop offset="25%" stopColor="#D15A8A">
                  <animate attributeName="stop-color" values="#D15A8A; #8054DC; #BD6C95; #E09050; #9172B9; #695FE4; #8052CD; #D15A8A" dur="10s" repeatCount="indefinite"></animate>
                </stop>
                <stop offset="42%" stopColor="#8054DC">
                  <animate attributeName="stop-color" values=" #8054DC; #BD6C95; #E09050; #9172B9; #695FE4; #8052CD; #D15A8A; #8054DC" dur="10s" repeatCount="indefinite"></animate>
                </stop>
                <stop offset="57%" stopColor="#BD6C95">
                  <animate attributeName="stop-color" values="#BD6C95; #E09050; #9172B9; #695FE4; #8052CD; #D15A8A; #8054DC; #BD6C95" dur="10s" repeatCount="indefinite"></animate>
                </stop>
                <stop offset="64%" stopColor="#E09050">
                  <animate attributeName="stop-color" values="#E09050; #9172B9; #695FE4; #8052CD; #D15A8A; #8054DC; #BD6C95; #E09050" dur="10s" repeatCount="indefinite"></animate>
                </stop>
                <stop offset="79%" stopColor="#9172B9">
                  <animate attributeName="stop-color" values="#9172B9; #695FE4; #8052CD; #D15A8A; #8054DC; #BD6C95; #E09050; #9172B9" dur="10s" repeatCount="indefinite"></animate>
                </stop>
                <stop offset="100%" stopColor="#695FE4">
                  <animate attributeName="stop-color" values="#695FE4; #8052CD; #D15A8A; #8054DC; #BD6C95; #E09050; #9172B9; #695FE4" dur="10s" repeatCount="indefinite"></animate>
                </stop>
                <animateTransform attributeName="gradientTransform" type="rotate" from="0 .5 .5" to="0 .5 .5" dur="10s" repeatCount="indefinite"></animateTransform>
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* SVG 2 - Bottom Left Wave */}
        <div className="absolute -bottom-[5%] left-0 w-[60%] min-w-[600px] max-w-[1000px] opacity-90">
          <svg xmlns="http://www.w3.org/2000/svg" width="846" height="422" viewBox="0 0 846 422" fill="none" className="w-full h-auto">
            <path d="M500.86 181.789L459.086 105.015C416.182 31.6271 381.182 0.0141094 305.536 0.0141061C229.891 0.0141027 194.891 31.6271 151.987 105.015L110.213 181.789C91.0193 217.918 57.1482 250.66 -12.8521 250.66L-129.143 250.66C-317.692 250.66 -221.724 509.21 -78.3363 390.661L194.891 182.918C236.665 150.176 263.762 136.628 305.536 137.757C347.311 136.628 374.408 150.176 416.182 182.918L689.409 390.661C832.797 509.21 928.765 250.66 740.216 250.66L623.925 250.66C553.925 250.66 520.054 217.918 500.86 181.789Z" fill="url(#pattern0)"></path>
            <defs>
              <linearGradient id="pattern0" x1="1080.03" y1="210.887" x2="0.929331" y2="210.887" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#8052CD">
                  <animate attributeName="stop-color" values="#8052CD; #D15A8A; #8054DC; #BD6C95; #E09050; #9172B9; #695FE4; #8052CD" dur="10s" repeatCount="indefinite"></animate>
                </stop>
                <stop offset="25%" stopColor="#D15A8A">
                  <animate attributeName="stop-color" values="#D15A8A; #8054DC; #BD6C95; #E09050; #9172B9; #695FE4; #8052CD; #D15A8A" dur="10s" repeatCount="indefinite"></animate>
                </stop>
                <stop offset="42%" stopColor="#8054DC">
                  <animate attributeName="stop-color" values=" #8054DC; #BD6C95; #E09050; #9172B9; #695FE4; #8052CD; #D15A8A; #8054DC" dur="10s" repeatCount="indefinite"></animate>
                </stop>
                <stop offset="57%" stopColor="#BD6C95">
                  <animate attributeName="stop-color" values="#BD6C95; #E09050; #9172B9; #695FE4; #8052CD; #D15A8A; #8054DC; #BD6C95" dur="10s" repeatCount="indefinite"></animate>
                </stop>
                <stop offset="64%" stopColor="#E09050">
                  <animate attributeName="stop-color" values="#E09050; #9172B9; #695FE4; #8052CD; #D15A8A; #8054DC; #BD6C95; #E09050" dur="10s" repeatCount="indefinite"></animate>
                </stop>
                <stop offset="79%" stopColor="#9172B9">
                  <animate attributeName="stop-color" values="#9172B9; #695FE4; #8052CD; #D15A8A; #8054DC; #BD6C95; #E09050; #9172B9" dur="10s" repeatCount="indefinite"></animate>
                </stop>
                <stop offset="100%" stopColor="#695FE4">
                  <animate attributeName="stop-color" values="#695FE4; #8052CD; #D15A8A; #8054DC; #BD6C95; #E09050; #9172B9; #695FE4" dur="10s" repeatCount="indefinite"></animate>
                </stop>
                <animateTransform attributeName="gradientTransform" type="rotate" from="0 .5 .5" to="0 .5 .5" dur="10s" repeatCount="indefinite"></animateTransform>
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* SVG 3 - Bottom Right Wave */}
        <div className="absolute -bottom-[5%] right-0 w-[60%] min-w-[700px] max-w-[1100px] opacity-90">
          <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="423" viewBox="0 0 1080 423" fill="none" className="w-full h-auto">
            <path d="M345.126 240.681L386.901 317.456C429.804 390.844 464.804 422.457 540.45 422.457C616.095 422.457 651.096 390.844 693.999 317.456L735.773 240.681C754.967 204.552 788.838 171.81 858.838 171.81L975.129 171.81C1163.68 171.81 1067.71 -86.7395 924.323 31.8095L651.096 239.552C609.321 272.295 582.224 285.843 540.45 284.714C498.676 285.843 471.579 272.295 429.804 239.552L156.577 31.8095C13.1894 -86.7394 -82.7788 171.81 105.77 171.81L222.061 171.81C292.062 171.81 325.933 204.552 345.126 240.681Z" fill="url(#gradient3)"></path>
            <defs>
              <linearGradient id="gradient3" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#240945">
                  <animate attributeName="stop-color" values="#240945; #772588; #E35375; #F94F39; #C65CEB; #5D00DB; #240945" dur="10s" repeatCount="indefinite"></animate>
                </stop>
                <stop offset="20%" stopColor="#772588">
                  <animate attributeName="stop-color" values="#772588; #E35375; #F94F39; #C65CEB; #5D00DB; #240945; #772588" dur="10s" repeatCount="indefinite"></animate>
                </stop>
                <stop offset="40%" stopColor="#E35375">
                  <animate attributeName="stop-color" values="#E35375; #F94F39; #C65CEB; #5D00DB; #240945; #772588; #E35375" dur="10s" repeatCount="indefinite"></animate>
                </stop>
                <stop offset="60%" stopColor="#F94F39">
                  <animate attributeName="stop-color" values="#F94F39; #C65CEB; #5D00DB; #240945; #772588; #E35375; #F94F39" dur="10s" repeatCount="indefinite"></animate>
                </stop>
                <stop offset="80%" stopColor="#C65CEB">
                  <animate attributeName="stop-color" values="#C65CEB; #5D00DB; #240945; #772588; #E35375; #F94F39; #C65CEB" dur="10s" repeatCount="indefinite"></animate>
                </stop>
                <stop offset="100%" stopColor="#5D00DB">
                  <animate attributeName="stop-color" values="#5D00DB; #240945; #772588; #E35375; #F94F39; #C65CEB; #5D00DB" dur="10s" repeatCount="indefinite"></animate>
                </stop>
                <animateTransform attributeName="gradientTransform" type="rotate" from="0 .5 .5" to="0 .5 .5" dur="10s" repeatCount="indefinite"></animateTransform>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-20">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
          className="mt-[60px] font-serif font-bold text-[32px] leading-[1.05] tracking-tight text-white sm:text-[42px] md:text-[52px] lg:text-[64px] max-w-[1100px]"
        >
          {title}
        </motion.h1>

        {description && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
            className="mt-10 md:mt-16 md:ml-auto md:w-[60%] flex max-w-[480px] items-start gap-4 pr-4"
          >
            <div className="mt-1.5 flex-shrink-0 text-[#E09050]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" />
              </svg>
            </div>
            <p className="text-[17px] leading-[1.6] text-white/90 font-sans md:text-[20px]">
              {description}
            </p>
          </motion.div>
        )}

        {children && <div className="mt-12 relative z-10">{children}</div>}
      </div>
    </section>
  );
}
