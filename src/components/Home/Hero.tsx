import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { BeamsBackground } from "@/components/ui/beams-background";
import { useNavigate } from "react-router";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import styles from "./Hero.module.css";
import { useTheme } from "@/components/theme-provider";
import { motion, AnimatePresence } from "framer-motion";

const Hero = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [, setIsVisible] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const firstRenderRef = useRef(true);

  // Memoize the background component to prevent unnecessary re-renders
  const BackgroundComponent = useMemo(
    () => (theme === "dark" ? BeamsBackground : AuroraBackground),
    [theme]
  );

  // Memoize handlers
  const copyCommand = useCallback(() => {
    navigator.clipboard.writeText("bun create elysia app");
    // Add visual feedback here if needed
  }, []);

  const handleGetStarted = useCallback(() => {
    navigate("/base");
  }, [navigate]);

  // Optimize refresh detection
  useEffect(() => {
    if (!firstRenderRef.current) return;

    const isPageRefresh = performance.navigation?.type === 1;
    if (isPageRefresh || sessionStorage.getItem("pageRefreshed") === "true") {
      setIsRefreshing(true);
      sessionStorage.setItem("pageRefreshed", "true");

      const timer = setTimeout(() => setIsRefreshing(false), 1500);
      return () => clearTimeout(timer);
    }

    firstRenderRef.current = false;
    return () => sessionStorage.removeItem("pageRefreshed");
  }, []);

  // Combine visibility and scroll indicator effects
  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => setShowScrollIndicator(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  // Optimize scroll handler with RAF and event passive option
  useEffect(() => {
    let rafId: number | null = null;
    let lastScrollY = 0;

    const handleScroll = () => {
      // Only update if we don't have a pending frame
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          // Only update state if value actually changed
          if (window.scrollY <= 100 !== lastScrollY <= 100) {
            setShowScrollIndicator(window.scrollY <= 100);
          }
          lastScrollY = window.scrollY;
          rafId = null;
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  // Animation variants for Framer Motion
  const fadeInUp = useMemo(
    () => ({
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
      },
    }),
    []
  );

  // MAIN RENDER - optimized with memoization and hardware acceleration
  return (
    <div className="relative will-change-transform">
      <BackgroundComponent intensity="strong">
        <AnimatePresence>
          <motion.div
            initial="hidden"
            animate="visible"
            className={`min-h-[90vh] pt-14 flex flex-col items-center justify-center text-center px-4 relative ${
              isRefreshing ? styles.refreshFadeIn : ""
            }`}
            style={{
              willChange: "opacity, transform",
              backfaceVisibility: "hidden",
            }}
          >
            {/* Logo Section - optimized animations */}
            <motion.div
              variants={fadeInUp}
              className={`mb-6 relative ${
                isRefreshing ? styles.refreshSlideDown : ""
              }`}
            >
              <div className="relative inline-block">
                <h1
                  className={`text-6xl font-bold tracking-tight ${
                    isRefreshing ? styles.refreshPulse : ""
                  }`}
                >
                  <img
                    src="https://store.supercell.com/_next/static/media/logo.985ee45d.png"
                    alt="Clash Of Clans"
                    className="h-30 sm:h-30 md:h-48 lg:h-52 xl:h-56 w-auto object-contain transition-all duration-300 drop-shadow-md hover:drop-shadow-xl transform hover:scale-105"
                    loading="eager"
                    width={400}
                    height={200}
                    onError={(e) => {
                      e.currentTarget.src = "/fallback-logo.png";
                      e.currentTarget.onerror = null;
                    }}
                  />
                </h1>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h2
              variants={fadeInUp}
              className={`text-4xl md:text-5xl font-bold bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent mb-4 ${
                isRefreshing ? styles.refreshSlideUp : ""
              }`}
            >
              Ultimate Base Building Strategy Hub
            </motion.h2>

            {/* Subheading with optimized animations */}
            <motion.p
              variants={fadeInUp}
              className={`text-lg md:text-xl text-gray-400/90 max-w-2xl mb-8 backdrop-blur-sm ${
                isRefreshing ? styles.refreshFadeIn : ""
              }`}
            >
              Find{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent font-semibold animate-pulse">
                proven strategies
              </span>{" "}
              and
              <span className="text-cyan-300/90 hover:text-cyan-200/90 transition-colors">
                {" "}
                expert layouts
              </span>{" "}
              for your Clash of Clans village. Dominate
              <span className="text-amber-300/90 font-medium hover:text-amber-200/90 transition-colors">
                {" "}
                clan wars
              </span>{" "}
              with our
              <span className="bg-gradient-to-br from-red-400 to-orange-300 bg-clip-text text-transparent hover:from-red-300 hover:to-orange-200 transition-colors">
                {" "}
                battle-tested base designs
              </span>
              .
            </motion.p>

            {/* CTA Buttons with optimized animations */}
            <motion.div
              variants={fadeInUp}
              className={`flex flex-col sm:flex-row gap-4 ${
                isRefreshing ? styles.refreshScaleIn : ""
              }`}
            >
              <Button
                size="lg"
                className="bg-pink-500 hover:bg-pink-600 text-white px-8 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-pink-500/20"
                onClick={handleGetStarted}
              >
                Get Started
              </Button>

              <div className="relative flex items-center group">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-purple-900/50 text-purple-300 pr-12 font-mono transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-purple-500/20"
                >
                  Copy Link Now!
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-0 text-purple-300 hover:text-purple-200 transition-all duration-300 group-hover:scale-110 group-active:scale-95"
                  onClick={copyCommand}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>

            {/* Scroll Indicator with optimized animations */}
            <AnimatePresence>
              {showScrollIndicator && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-8"
                >
                  <p className="text-gray-400 text-sm mb-2">
                    See why clash players love CHEA
                  </p>
                  <div className="animate-bounce">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mx-auto text-gray-400"
                    >
                      <path
                        d="M12 5L12 19M19 12L12 19L5 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </BackgroundComponent>
    </div>
  );
};

export default Hero;
