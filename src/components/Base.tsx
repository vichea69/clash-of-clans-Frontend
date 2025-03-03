import { useEffect, useState, useCallback, useRef } from "react";
import { fetchBases } from "@/api/baseApi";
import { useAuth } from "@clerk/clerk-react";

// Import our component parts
import { Header } from "./base/Header";
import { UserBanner } from "./base/UserBanner";
import { ComponentGrid } from "./base/ComponentGrid";
import { BackToTopButton } from "./base/BackToTopButton";
import { Base as BaseType } from "@/types/base"; // Assuming you move the interface to a types file

// Sort options for dropdown
export const SORT_OPTIONS = [
  { id: "recommended", label: "Recommended" },
  { id: "popular", label: "Most Popular" },
  { id: "latest", label: "Latest" },
  { id: "trending", label: "Trending" },
];

const Base = () => {
  // State management
  const { isSignedIn } = useAuth();
  const [components, setComponents] = useState<BaseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [activeSort, setActiveSort] = useState(SORT_OPTIONS[0]);

  // Refs
  const headerRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Data fetching
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

  // Animation and scroll behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";

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

    return () => {
      document.documentElement.style.scrollBehavior = "";
      if (mainContentRef.current) {
        observer.unobserve(mainContentRef.current);
      }
    };
  }, []);

  // Mobile menu handling
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

  // Event handlers
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const handleSortChange = useCallback((option: (typeof SORT_OPTIONS)[0]) => {
    setActiveSort(option);
    // Here you would typically re-fetch or sort your data
  }, []);

  const handleRetry = useCallback(() => {
    setRetryCount((count) => count + 1);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header Component */}
      <Header
        ref={headerRef}
        mobileMenuOpen={mobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        closeMobileMenu={closeMobileMenu}
        activeSort={activeSort}
        handleSortChange={handleSortChange}
      />

      {/* Main Content */}
      <main
        ref={mainContentRef}
        className={`container py-4 px-4 sm:px-6 sm:py-6 transition-opacity duration-700 ease-in-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* User Banner Component */}
        <UserBanner isSignedIn={isSignedIn} />

        {/* Component Grid */}
        <ComponentGrid
          components={components}
          loading={loading}
          error={error}
          handleRetry={handleRetry}
        />

        {/* Back to Top Button Component */}
        <BackToTopButton />
      </main>
    </div>
  );
};

export default Base;
