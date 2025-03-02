import { ChevronDown, Copy, Menu, X } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Avatar from "@radix-ui/react-avatar";
import { useEffect, useState, useCallback, memo, useRef, useMemo } from "react";
import { fetchBases } from "@/api/baseApi";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

// Define proper interface based on BaseList.tsx
interface Base {
  id: number;
  name: string;
  imageUrl: string;
  link: string;
  createdAt?: string; // Add this field
  updatedAt?: string; // Add this field
  user: {
    name: string;
    avatar?: string;
  };
  clerkUserId?: string; // Add this field to track who uploaded with Clerk
}

// Extracted component for better code organization and performance
const ComponentCard = memo(({ component }: { component: Base }) => {
  const { user, isSignedIn } = useUser();

  // Only check for creator status if user is signed in
  const isCreator = useMemo(
    () => isSignedIn && user?.id === component.clerkUserId,
    [isSignedIn, user?.id, component.clerkUserId]
  );

  // Memoize functions to prevent recreation on each render
  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(component.link || window.location.href);
    toast.success("Link copied", {
      duration: 2000,
      position: window.innerWidth < 640 ? "top-center" : "bottom-right",
    });
  }, [component.link]);

  // Memoize user data
  const avatarUrl = useMemo(() => {
    if (isCreator && user?.imageUrl) {
      return user.imageUrl;
    }
    return component.user?.avatar || "/placeholder.svg";
  }, [isCreator, user?.imageUrl, component.user?.avatar]);

  const userName = useMemo(() => {
    if (isCreator) {
      return user?.username || user?.firstName || "You";
    }
    return component.user?.name || "Unknown user";
  }, [isCreator, user?.username, user?.firstName, component.user?.name]);

  return (
    <div className="group relative rounded-lg border overflow-hidden transition-all duration-300 hover:shadow-md transform hover:translate-y-[-5px]">
      <button
        onClick={copyLink}
        aria-label="Copy link"
        className="absolute left-1.5 top-1.5 sm:left-2 sm:top-2 z-10 
          rounded-md bg-background/90 p-2 sm:p-2.5
          opacity-0 group-hover:opacity-100 transition-all duration-300
          border border-border/40 shadow-sm
          hover:bg-accent hover:text-accent-foreground
          active:scale-95
          focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </button>
      {isCreator && (
        <Badge
          variant="secondary"
          className="absolute right-1.5 top-1.5 sm:right-2 sm:top-2 z-10
            text-[10px] sm:text-xs font-medium"
        >
          Your Upload
        </Badge>
      )}
      <a href={component.link} className="block touch-manipulation">
        <div className="aspect-square relative overflow-hidden w-full h-full bg-gray-100">
          {/* Fallback content */}
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xl font-medium">
            {component.name.charAt(0).toUpperCase()}
          </div>

          {/* Image with lazy loading */}
          {component.imageUrl && (
            <img
              src={component.imageUrl}
              alt={component.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}
        </div>
        <div className="p-2 sm:p-3 md:p-4">
          <div className="flex justify-between items-end">
            <div className="flex items-center flex-1">
              <Avatar.Root className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 rounded-full overflow-hidden border flex-shrink-0">
                <Avatar.Image
                  src={avatarUrl}
                  alt={userName}
                  className="h-full w-full object-cover"
                />
                <Avatar.Fallback className="flex h-full w-full items-center justify-center bg-muted text-[10px] sm:text-xs">
                  {userName[0]}
                </Avatar.Fallback>
              </Avatar.Root>
              <div className="ml-1.5 sm:ml-2 overflow-hidden">
                <span className="text-[10px] sm:text-xs text-muted-foreground truncate block">
                  by {userName}
                </span>
              </div>
            </div>
            {component.createdAt && (
              <span className="text-[10px] sm:text-xs text-muted-foreground ml-2">
                {new Date(component.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </a>
    </div>
  );
});

// Skeleton loader component for better UX during loading
const SkeletonCard = () => (
  <div className="rounded-lg border overflow-hidden animate-pulse">
    <div className="aspect-square bg-gray-200"></div>
    <div className="p-3 sm:p-4">
      <div className="flex items-center">
        <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-gray-200 flex-shrink-0"></div>
        <div className="ml-2 flex-1 min-w-0">
          <div className="h-4 w-full max-w-[120px] bg-gray-200 rounded mb-2"></div>
          <div className="h-3 w-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

const Base = () => {
  const { isSignedIn } = useAuth();
  const [components, setComponents] = useState<Base[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const [retryCount, setRetryCount] = useState(0);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Load data using the fetchBases function directly
  useEffect(() => {
    const loadBases = async () => {
      try {
        setLoading(true);
        const basesData = await fetchBases();

        if (Array.isArray(basesData)) {
          setComponents(basesData);
        } else {
          setError(
            "Expected an array of components but received a different format"
          );
          console.error("Unexpected data format:", basesData);
        }
      } catch (err) {
        console.error("Error loading bases:", err);
        setError("Failed to load components. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadBases();
  }, [retryCount]);

  // Add smooth scrolling behavior when component mounts
  useEffect(() => {
    // Apply smooth scrolling to the document
    document.documentElement.style.scrollBehavior = "smooth";

    // Set up intersection observer for fade-in animation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (mainContentRef.current) {
      observer.observe(mainContentRef.current);
    }

    // Cleanup function
    return () => {
      document.documentElement.style.scrollBehavior = "";
      if (mainContentRef.current) {
        observer.unobserve(mainContentRef.current);
      }
    };
  }, []);

  // Close mobile menu when clicking outside or when a link is clicked
  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  // Toggle mobile menu with improved touch handling
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  // Menu items for the dropdown
  const sortOptions = useMemo(
    () => [
      { id: "recommended", label: "Recommended" },
      { id: "popular", label: "Most Popular" },
      { id: "latest", label: "Latest" },
      { id: "trending", label: "Trending" },
    ],
    []
  );

  const [activeSort, setActiveSort] = useState(sortOptions[0]);

  const handleSortChange = useCallback((option: (typeof sortOptions)[0]) => {
    setActiveSort(option);
    // Here you would typically re-fetch or sort your data
  }, []);

  // Handle retry with tracking retry count
  const handleRetry = useCallback(() => {
    setRetryCount((count) => count + 1);
  }, []);

  // Add touch event listener to close menu when tapping outside
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleTouchOutside = (e: TouchEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("touchstart", handleTouchOutside);
    return () => {
      document.removeEventListener("touchstart", handleTouchOutside);
    };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-background">
      <header
        ref={headerRef}
        className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container flex h-14 sm:h-16 items-center">
          {/* Mobile menu button with larger touch target */}
          <button
            onClick={toggleMobileMenu}
            className="mr-2 md:hidden p-3 focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <a href="#" className="transition-colors hover:text-foreground/80">
              Components
            </a>
            <a href="#" className="transition-colors hover:text-foreground/80">
              Templates
            </a>
            <a href="#" className="transition-colors hover:text-foreground/80">
              Categories
            </a>
            <a href="#" className="transition-colors hover:text-foreground/80">
              Design Engineers
            </a>
            <a href="#" className="transition-colors hover:text-foreground/80">
              Pro
            </a>
          </nav>

          {/* Mobile navigation with improved touch targets */}
          {mobileMenuOpen && (
            <div
              className="fixed inset-0 top-14 sm:top-16 z-50 bg-background md:hidden overflow-auto"
              onClick={closeMobileMenu} // Close when clicking the backdrop
            >
              <nav className="flex flex-col py-2 border-b shadow-lg">
                <a
                  href="#"
                  className="px-4 py-5 hover:bg-accent active:bg-accent/80"
                  onClick={closeMobileMenu}
                >
                  Components
                </a>
                <a
                  href="#"
                  className="px-4 py-5 hover:bg-accent active:bg-accent/80"
                  onClick={closeMobileMenu}
                >
                  Templates
                </a>
                <a
                  href="#"
                  className="px-4 py-5 hover:bg-accent active:bg-accent/80"
                  onClick={closeMobileMenu}
                >
                  Categories
                </a>
                <a
                  href="#"
                  className="px-4 py-5 hover:bg-accent active:bg-accent/80"
                  onClick={closeMobileMenu}
                >
                  Design Engineers
                </a>
                <a
                  href="#"
                  className="px-4 py-5 hover:bg-accent active:bg-accent/80"
                  onClick={closeMobileMenu}
                >
                  Pro
                </a>
              </nav>
            </div>
          )}

          {/* Sort dropdown with larger touch targets on mobile */}
          <div className="ml-auto">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  className="flex items-center gap-2 px-3 sm:px-4 py-2.5
                  text-sm font-medium transition-colors 
                  hover:bg-accent hover:text-accent-foreground 
                  active:bg-accent/80
                  rounded-md"
                >
                  {activeSort.label}
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="z-50 min-w-[8rem] overflow-hidden rounded-md 
                  border bg-popover p-1 text-popover-foreground shadow-md"
                  sideOffset={4}
                  align="end"
                >
                  {sortOptions.map((option) => (
                    <DropdownMenu.Item
                      key={option.id}
                      className="relative flex cursor-default select-none 
                        items-center rounded-sm px-4 py-3.5 text-sm outline-none 
                        transition-colors hover:bg-accent hover:text-accent-foreground
                        active:bg-accent/80"
                      onClick={() => handleSortChange(option)}
                    >
                      {option.label}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>
      </header>

      <main
        ref={mainContentRef}
        className={`container py-4 px-4 sm:px-6 sm:py-6 transition-opacity duration-700 ease-in-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {isSignedIn ? (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg transform transition-transform duration-500 hover:scale-[1.01]">
            <p className="text-sm text-blue-600">Welcome back!</p>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg transform transition-transform duration-500 hover:scale-[1.01]">
            <p className="text-sm text-gray-600">
              Sign in to upload your own bases and see which ones you've
              created.
            </p>
          </div>
        )}

        {/* Improved grid for mobile with animation */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="p-4 sm:p-8 text-center rounded-lg border border-red-200 bg-red-50 text-red-500 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <p className="font-medium mb-2">{error}</p>
            <button
              onClick={handleRetry}
              className="mt-2 px-5 py-3 bg-red-100 hover:bg-red-200 active:bg-red-300
                rounded-md text-sm font-medium transition-colors transform transition-transform hover:scale-105 active:scale-95"
            >
              Try Again
            </button>
          </div>
        ) : components.length === 0 ? (
          <div className="p-6 text-center rounded-lg border bg-background animate-in fade-in slide-in-from-bottom-5 duration-700">
            <p className="text-muted-foreground">No components available</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {components.map((component, index) => (
              <div
                key={component.id}
                className="animate-in fade-in slide-in-from-bottom-5"
                style={{
                  animationDelay: `${Math.min(index * 50, 500)}ms`,
                  animationDuration: "500ms",
                }}
              >
                <ComponentCard component={component} />
              </div>
            ))}
          </div>
        )}

        {/* Back to top button - appears when scrolling down */}
        <button
          onClick={() => window.scrollTo({ top: 0 })}
          className="fixed bottom-4 right-4 p-3 bg-primary text-primary-foreground rounded-full shadow-lg transition-all duration-300 hover:bg-primary/90 active:scale-95"
          aria-label="Back to top"
          style={{
            opacity: window.scrollY > 300 ? 1 : 0,
            transform:
              window.scrollY > 300 ? "translateY(0)" : "translateY(10px)",
            pointerEvents: window.scrollY > 300 ? "auto" : "none",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 2.33331L7 11.6666"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2.33334 7L7.00001 2.33333L11.6667 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </main>
    </div>
  );
};

export default Base;
