import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { AuroraBackground } from "@/components/ui/aurora-background";

const Hero = () => {
  const copyCommand = () => {
    navigator.clipboard.writeText("bun create elysia app");
  };

  return (
    <AuroraBackground>
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 relative z-10">
        {/* Logo */}
        <div className="mb-6 relative">
          {/* Japanese Text */}
          <span className="absolute -top-4 left-0 text-sm text-pink-300/80 font-medium tracking-wider">
            ビチア デベロッパー
          </span>

          {/* Main Logo Text */}
          <div className="relative inline-block">
            <h1 className="text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Clash Of Clans
              </span>
              <span className="absolute -top-1 right-0 text-pink-400/80 text-2xl">
                +
              </span>
              {/* <span className="absolute -right-6 top-0 text-yellow-200/80 text-sm">
                35
              </span> */}
            </h1>

            {/* Logo Border/Background */}
          </div>
        </div>

        {/* Main Heading */}

        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent mb-4">
          Ultimate Base Building Strategy Hub
        </h2>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-gray-400/90 max-w-2xl mb-8 backdrop-blur-sm">
          Find{" "}
          <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent font-semibold">
            proven strategies
          </span>{" "}
          and
          <span className="text-cyan-300/90"> expert layouts</span> for your
          Clash of Clans village. Dominate
          <span className="text-amber-300/90 font-medium"> clan wars</span> with
          our
          <span className="bg-gradient-to-br from-red-400 to-orange-300 bg-clip-text text-transparent">
            {" "}
            battle-tested base designs
          </span>
          .
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            size="lg"
            className="bg-pink-500 hover:bg-pink-600 text-white px-8"
          >
            Get Started
          </Button>

          <div className="relative flex items-center">
            <Button
              variant="secondary"
              size="lg"
              className="bg-purple-900/50 text-purple-300 pr-12 font-mono"
            >
              Copy Link Now!
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-0 text-purple-300 hover:text-purple-200"
              onClick={copyCommand}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8">
          <p className="text-gray-400 text-sm">
            See why clash players love CHEA↓
          </p>
        </div>
      </div>
    </AuroraBackground>
  );
};

export default Hero;
