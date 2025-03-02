import { useState } from "react";
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

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setTheme } = useTheme();
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const navigation = [
    { title: "Home", path: "/" },
    { title: "Base Layouts", path: "/base" },
  ];

  // Mobile UserButton click handler to prevent menu from closing
  const handleUserButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up to parent elements
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-transparent backdrop-blur-sm supports-[backdrop-filter]:bg-background/20">
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

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigation.map((item, idx) => (
              <Link
                key={idx}
                to={item.path}
                className="transition-all hover:text-foreground/80 text-foreground/60 dark:text-foreground/70 dark:hover:text-foreground/90 hover:scale-105 active:scale-95 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-blue-400 after:via-purple-400 after:to-pink-400 after:transition-all hover:after:w-full"
              >
                {item.title}
              </Link>
            ))}
            {isSignedIn && (
              <>
                <Link
                  to="/dashboard"
                  className="transition-all hover:text-foreground/80 text-foreground/60 dark:text-foreground/70 dark:hover:text-foreground/90 hover:scale-105 active:scale-95 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-blue-400 after:via-purple-400 after:to-pink-400 after:transition-all hover:after:w-full"
                >
                  Dashboard
                </Link>
                <Link
                  to="/dashboard?showBaseUpload=true"
                  className="transition-all hover:text-foreground/80 text-foreground/60 dark:text-foreground/70 dark:hover:text-foreground/90 hover:scale-105 active:scale-95 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-blue-400 after:via-purple-400 after:to-pink-400 after:transition-all hover:after:w-full"
                >
                  Upload Base
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Right Section - Dark Mode & Menu */}
        <div className="flex items-center space-x-4">
          {/* Dark Mode - Visible on all screens */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 dark:text-foreground/80 dark:hover:text-foreground dark:hover:bg-accent/50 transition-transform hover:scale-110 active:scale-95"
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
                onClick={() => setTheme("light")}
                className="dark:hover:bg-accent/40"
              >
                Light
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("dark")}
                className="dark:hover:bg-accent/40"
              >
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("system")}
                className="dark:hover:bg-accent/40"
              >
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Desktop Only Items */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="https://github.com/vichea69"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 w-9 px-0 dark:hover:bg-accent/40 dark:text-foreground/80 dark:hover:text-foreground hover:scale-110 active:scale-95"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>

            <div className="flex items-center gap-4">
              {isSignedIn ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    Hello, {user?.firstName || "User"}
                  </span>
                  <div className="transition-transform hover:scale-105">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </div>
              ) : (
                <>
                  <Link
                    to="/sign-in"
                    className="transition-all hover:text-foreground/80 text-foreground/60 dark:text-foreground/70 dark:hover:text-foreground/90 hover:scale-105 active:scale-95 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-blue-400 after:via-purple-400 after:to-pink-400 after:transition-all hover:after:w-full"
                  >
                    Login
                  </Link>
                  <Link
                    to="/sign-up"
                    className="transition-transform hover:scale-105 active:scale-95"
                  >
                    <GradientButton variant="variant">Sign Up</GradientButton>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground h-9 py-2 w-9 px-0 dark:hover:bg-accent/40 dark:text-foreground/80 dark:hover:text-foreground hover:scale-110 active:scale-95"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5 animate-in fade-in zoom-in duration-200" />
            ) : (
              <Menu className="h-5 w-5 animate-in fade-in zoom-in duration-200" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden backdrop-blur-md bg-background/10 animate-in slide-in-from-top duration-300">
          <div className="container py-4">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.path}
                  className="text-sm font-medium transition-all hover:text-foreground/80 text-foreground/60 dark:text-foreground/70 dark:hover:text-foreground/90 hover:translate-x-1 active:scale-98"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.title}
                </Link>
              ))}

              {/* Add Dashboard and Upload Base links in mobile menu when signed in */}
              {isSignedIn && (
                <>
                  <Link
                    to="/dashboard"
                    className="text-sm font-medium transition-all hover:text-foreground/80 text-foreground/60 dark:text-foreground/70 dark:hover:text-foreground/90 hover:translate-x-1 active:scale-98"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/dashboard?showBaseUpload=true"
                    className="text-sm font-medium transition-all hover:text-foreground/80 text-foreground/60 dark:text-foreground/70 dark:hover:text-foreground/90 flex items-center hover:translate-x-1 active:scale-98"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-pink-400">Upload Base</span>
                    <span className="ml-2 px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full animate-pulse">
                      New
                    </span>
                  </Link>
                </>
              )}

              <div className="flex flex-col space-y-3 pt-4 border-t border-border/40 dark:border-border/30">
                <Link
                  to="https://github.com/vichea69"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-2 text-sm font-medium transition-all hover:text-foreground/80 text-foreground/60 dark:text-foreground/70 dark:hover:text-foreground/90 hover:translate-x-1 active:scale-98"
                >
                  <Github className="h-5 w-5" />
                  <span>GitHub</span>
                </Link>

                {/* Improved mobile auth section */}
                {isSignedIn ? (
                  <div className="mt-4 pt-4 border-t border-border/40 dark:border-border/30">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">
                        Hello, {user?.firstName || "User"}
                      </span>
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
                    <Link
                      to="/sign-in"
                      className="inline-flex items-center justify-center w-full rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 dark:hover:bg-accent/40 dark:text-foreground/90 hover:scale-[1.02] active:scale-[0.98]"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/sign-up"
                      className="inline-flex items-center justify-center w-full rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 dark:bg-primary/90 dark:hover:bg-primary hover:scale-[1.02] active:scale-[0.98]"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
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
