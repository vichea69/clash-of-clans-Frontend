import { useState, useCallback, memo, useMemo } from "react";
import { Link } from "react-router";
import { Moon, Sun, Github, Menu, X } from "lucide-react";
import { useTheme } from "./theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth, UserButton, useUser } from "@clerk/clerk-react";
import { GradientButton } from "./buttons/gradient-button/gradient-button";

// Memoize navigation items to prevent recreation on each render
const navigationItems = [
  { title: "Home", path: "/" },
  { title: "Base Layouts", path: "/base" },
];

// Memoize the auth links to prevent recreation on each render
const MemoizedAuthLinks = memo(
  ({ onMenuClose }: { onMenuClose?: () => void }) => {
    return (
      <>
        <Link
          to="/sign-in"
          className="transition-all hover:text-foreground/80 text-foreground/60 dark:text-foreground/70 dark:hover:text-foreground/90 hover:scale-105 active:scale-95 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-blue-400 after:via-purple-400 after:to-pink-400 after:transition-all hover:after:w-full"
          onClick={onMenuClose}
        >
          Login
        </Link>
        <Link
          to="/sign-up"
          className="transition-transform hover:scale-105 active:scale-95"
          onClick={onMenuClose}
        >
          <GradientButton variant="variant">Sign Up</GradientButton>
        </Link>
      </>
    );
  }
);
MemoizedAuthLinks.displayName = "MemoizedAuthLinks";

// Memoize the navigation links to prevent recreation on each render
const MemoizedNavLinks = memo(
  ({
    isSignedIn,
    onMenuClose,
  }: {
    isSignedIn: boolean | undefined;
    onMenuClose?: () => void;
  }) => {
    return (
      <>
        {navigationItems.map((item, idx) => (
          <Link
            key={idx}
            to={item.path}
            className="transition-all hover:text-foreground/80 text-foreground/60 dark:text-foreground/70 dark:hover:text-foreground/90 hover:scale-105 active:scale-95 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-blue-400 after:via-purple-400 after:to-pink-400 after:transition-all hover:after:w-full"
            onClick={onMenuClose}
          >
            {item.title}
          </Link>
        ))}
        {isSignedIn && (
          <>
            <Link
              to="/dashboard"
              className="transition-all hover:text-foreground/80 text-foreground/60 dark:text-foreground/70 dark:hover:text-foreground/90 hover:scale-105 active:scale-95 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-blue-400 after:via-purple-400 after:to-pink-400 after:transition-all hover:after:w-full"
              onClick={onMenuClose}
            >
              Dashboard
            </Link>
            <Link
              to="/dashboard?showBaseUpload=true"
              className="transition-all hover:text-foreground/80 text-foreground/60 dark:text-foreground/70 dark:hover:text-foreground/90 hover:scale-105 active:scale-95 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-blue-400 after:via-purple-400 after:to-pink-400 after:transition-all hover:after:w-full"
              onClick={onMenuClose}
            >
              Upload Base
            </Link>
          </>
        )}
      </>
    );
  }
);
MemoizedNavLinks.displayName = "MemoizedNavLinks";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setTheme } = useTheme();
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  // Memoize handlers to prevent recreation on each render
  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleMenuClose = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Mobile UserButton click handler to prevent menu from closing
  const handleUserButtonClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up to parent elements
  }, []);

  // Memoize theme setters to prevent recreation on each render
  const setLightTheme = useCallback(() => setTheme("light"), [setTheme]);
  const setDarkTheme = useCallback(() => setTheme("dark"), [setTheme]);
  const setSystemTheme = useCallback(() => setTheme("system"), [setTheme]);

  // Memoize the greeting for better performance
  const greeting = useMemo(() => {
    return `Hello, ${user?.firstName || "User"}`;
  }, [user?.firstName]);

  return (
    <header className="sticky top-0 z-50 w-full bg-transparent backdrop-blur-sm supports-[backdrop-filter]:bg-background/20 will-change-transform">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        {/* Logo Section - Visible on all screens */}
        <div className="flex items-center space-x-2">
          <Link
            to="/"
            className="flex items-center space-x-2 transition-transform hover:scale-105 active:scale-95"
          >
            <span className="font-bold bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-pink-500 dark:from-cyan-300 dark:via-fuchsia-400 dark:to-pink-400 bg-clip-text text-transparent animate-gradient-x drop-shadow-sm hover:drop-shadow-md transition-all">
              Clash Of Base
            </span>
          </Link>
          <span className="hidden sm:inline-block text-xs text-foreground/60 dark:text-foreground/70">
            Free CoC Base Layouts
          </span>
        </div>

        {/* Desktop Navigation - Optimized with memoization */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <MemoizedNavLinks
              isSignedIn={isSignedIn ?? false}
              onMenuClose={handleMenuClose}
            />
          </nav>
        </div>

        {/* Right Section - Dark Mode & Menu - Optimized with memoization */}
        <div className="flex items-center space-x-4">
          {/* Dark Mode - Visible on all screens */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 dark:text-foreground/80 dark:hover:text-foreground dark:hover:bg-accent/50 transition-transform hover:scale-110 active:scale-95"
                style={{
                  willChange: "transform",
                  backfaceVisibility: "hidden",
                }}
              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="dark:bg-background/95 dark:border-border/30"
            >
              <DropdownMenuItem
                onClick={setLightTheme}
                className="dark:hover:bg-accent/40"
              >
                Light
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={setDarkTheme}
                className="dark:hover:bg-accent/40"
              >
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={setSystemTheme}
                className="dark:hover:bg-accent/40"
              >
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Desktop Only Items - Optimized with CSS transforms */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="https://github.com/vichea69"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 w-9 px-0 dark:hover:bg-accent/40 dark:text-foreground/80 dark:hover:text-foreground hover:scale-110 active:scale-95"
              style={{ willChange: "transform" }}
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>

            <div className="flex items-center gap-4">
              {isSignedIn ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{greeting}</span>
                  <div
                    className="transition-transform hover:scale-105"
                    style={{ willChange: "transform" }}
                  >
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </div>
              ) : (
                <MemoizedAuthLinks />
              )}
            </div>
          </div>

          {/* Mobile Menu Button - Optimized with hardware acceleration */}
          <button
            onClick={handleMenuToggle}
            className="md:hidden inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground h-9 py-2 w-9 px-0 dark:hover:bg-accent/40 dark:text-foreground/80 dark:hover:text-foreground hover:scale-110 active:scale-95"
            style={{ willChange: "transform, opacity" }}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5 animate-in fade-in zoom-in duration-200" />
            ) : (
              <Menu className="h-5 w-5 animate-in fade-in zoom-in duration-200" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Optimized with will-change and transform */}
      {isMenuOpen && (
        <div
          className="md:hidden backdrop-blur-md bg-background/10 animate-in slide-in-from-top duration-300"
          style={{
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
        >
          <div className="container py-4">
            <nav className="flex flex-col space-y-4">
              <MemoizedNavLinks
                isSignedIn={isSignedIn ?? false}
                onMenuClose={handleMenuClose}
              />

              <div className="flex flex-col space-y-3 pt-4 border-t border-border/40 dark:border-border/30">
                <Link
                  to="https://github.com/vichea69"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-2 text-sm font-medium transition-all hover:text-foreground/80 text-foreground/60 dark:text-foreground/70 dark:hover:text-foreground/90 hover:translate-x-1 active:scale-98"
                  onClick={handleMenuClose}
                >
                  <Github className="h-5 w-5" />
                  <span>GitHub</span>
                </Link>

                {/* Improved mobile auth section */}
                {isSignedIn ? (
                  <div className="mt-4 pt-4 border-t border-border/40 dark:border-border/30">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">{greeting}</span>
                      {/* Enhanced UserButton for mobile */}
                      <div className="z-[999]" onClick={handleUserButtonClick}>
                        <UserButton
                          afterSignOutUrl="/"
                          appearance={{
                            elements: {
                              userButtonAvatarBox: "w-10 h-10",
                              userButtonTrigger: "focus:shadow-none",
                              userButtonPopoverCard: "z-[999] shadow-lg",
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3 mt-4 pt-4 border-t border-border/40 dark:border-border/30">
                    <MemoizedAuthLinks onMenuClose={handleMenuClose} />
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
