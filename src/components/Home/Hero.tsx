import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

const Hero = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  const copyCommand = () => {
    navigator.clipboard.writeText("bun create elysia app");
    // You could add a toast notification here
  };

  // Animation sequence on component mount
  useEffect(() => {
    setIsVisible(true);

    // Show scroll indicator after a delay
    const timer = setTimeout(() => {
      setShowScrollIndicator(true);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  // Handle scroll animation for the indicator
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AuroraBackground>
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 relative z-10">
        {/* Logo */}
        <div
          className={`mb-6 relative transition-all duration-1000 transform ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-10"
          }`}
        >
          {/* Main Logo Text */}
          <div className="relative inline-block">
            <h1 className="text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
                Clash Of Clans
              </span>
            </h1>
          </div>
        </div>

        {/* Main Heading */}
        <h2
          className={`text-4xl md:text-5xl font-bold bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent mb-4 transition-all duration-1000 delay-300 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          Ultimate Base Building Strategy Hub
        </h2>

        {/* Subheading */}
        <p
          className={`text-lg md:text-xl text-gray-400/90 max-w-2xl mb-8 backdrop-blur-sm transition-all duration-1000 delay-500 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
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
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-700 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <Button
            size="lg"
            className="bg-pink-500 hover:bg-pink-600 text-white px-8 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-pink-500/20"
            onClick={() => navigate("/base")}
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
        </div>

        {/* Scroll Indicator with animation */}
        <div
          className={`absolute bottom-8 transition-all duration-500 transform ${
            showScrollIndicator
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-5"
          }`}
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
                d="M12 5L12 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19 12L12 19L5 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </AuroraBackground>
  );
};

export default Hero;
