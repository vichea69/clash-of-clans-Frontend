import { ChevronDown, Copy, Menu, X } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Avatar from "@radix-ui/react-avatar";
import { useEffect, useState, useCallback, memo, useRef } from "react";
import { fetchBases } from "@/api/baseApi";

// Define proper interface based on BaseList.tsx
interface Base {
  id: number;
  name: string;
  imageUrl: string;
  link: string;
  views?: string;
  likes?: number;
  user: {
    name: string;
    avatar?: string;
  };
}

// Extracted component for better code organization and performance
const ComponentCard = memo(({ component }: { component: Base }) => {
  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(component.link || window.location.href);
  }, [component.link]);

  return (
    <div className="group relative rounded-lg border overflow-hidden transition-all duration-200 hover:shadow-md">
      <button
        onClick={copyLink}
        aria-label="Copy link"
        className="absolute left-2 top-2 z-10 rounded-md bg-white/90 p-2 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100 touch-action:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary md:opacity-0 sm:opacity-100"
      >
        <Copy className="h-4 w-4" />
      </button>
      <a href={component.link} className="block">
        <div className="aspect-square relative overflow-hidden">
          <img
            src={component.imageUrl || "/placeholder.svg"}
            alt={component.name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="p-3 sm:p-4">
          <div className="flex items-center">
            <Avatar.Root className="h-6 w-6 sm:h-8 sm:w-8 rounded-full overflow-hidden border">
              <Avatar.Image
                src={component.user?.avatar || "/placeholder.svg"}
                alt={component.user?.name || "Unknown"}
                className="h-full w-full object-cover"
              />
              <Avatar.Fallback className="flex h-full w-full items-center justify-center bg-muted">
                {(component.user?.name || "U")[0]}
              </Avatar.Fallback>
            </Avatar.Root>
            <span className="font-medium text-sm sm:text-base truncate ml-2">
              {component.name}
            </span>
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
        <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-gray-200"></div>
        <div className="h-4 w-32 bg-gray-200 rounded ml-2"></div>
      </div>
    </div>
  </div>
);

const Base = () => {
  const [components, setComponents] = useState<Base[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

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
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Menu items for the dropdown
  const sortOptions = [
    { id: "recommended", label: "Recommended" },
    { id: "popular", label: "Most Popular" },
    { id: "latest", label: "Latest" },
    { id: "trending", label: "Trending" },
  ];

  const [activeSort, setActiveSort] = useState(sortOptions[0]);

  const handleSortChange = useCallback((option: (typeof sortOptions)[0]) => {
    setActiveSort(option);
    // Here you would typically re-fetch or sort your data
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header
        ref={headerRef}
        className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container flex h-14 items-center">
          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="mr-2 md:hidden focus:outline-none focus:ring-2 focus:ring-primary rounded-md p-1"
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

          {/* Mobile navigation */}
          {mobileMenuOpen && (
            <div className="absolute top-14 left-0 right-0 bg-background border-b shadow-lg md:hidden z-50">
              <nav className="flex flex-col py-2">
                <a href="#" className="px-4 py-2 hover:bg-accent">
                  Components
                </a>
                <a href="#" className="px-4 py-2 hover:bg-accent">
                  Templates
                </a>
                <a href="#" className="px-4 py-2 hover:bg-accent">
                  Categories
                </a>
                <a href="#" className="px-4 py-2 hover:bg-accent">
                  Design Engineers
                </a>
                <a href="#" className="px-4 py-2 hover:bg-accent">
                  Pro
                </a>
              </nav>
            </div>
          )}

          <div className="ml-auto">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground rounded-md">
                  {activeSort.label}
                  <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
                  {sortOptions.map((option) => (
                    <DropdownMenu.Item
                      key={option.id}
                      className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-xs sm:text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
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

      <main className="container py-4 sm:py-6">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="p-4 sm:p-8 text-center rounded-lg border border-red-200 bg-red-50 text-red-500">
            <p className="font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 sm:mt-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-red-100 hover:bg-red-200 rounded-md text-xs sm:text-sm font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : components.length === 0 ? (
          <div className="p-4 sm:p-8 text-center rounded-lg border bg-background">
            <p className="text-muted-foreground">No components available</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
            {components.map((component) => (
              <ComponentCard key={component.id} component={component} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Base;
