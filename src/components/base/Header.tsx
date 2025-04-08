import { forwardRef } from "react";
import { Menu, X } from "lucide-react";
import { MonthFilter } from "./MonthFilter";

interface HeaderProps {
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  activeMonth: string | null;
  onMonthChange: (monthYear: string | null) => void;
}

export const Header = forwardRef<HTMLDivElement, HeaderProps>(
  (
    {
      mobileMenuOpen,
      toggleMobileMenu,
      closeMobileMenu,
      activeMonth,
      onMonthChange,
    },
    ref
  ) => {
    // Navigation links data
    const navLinks = [
      { href: "#", label: "❤️" },
      
    ];

    return (
      <header
        ref={ref}
        className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container flex h-14 sm:h-16 items-center">
          {/* Mobile menu button */}
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
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-foreground/80"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Mobile navigation */}
          {mobileMenuOpen && (
            <div
              className="fixed inset-0 top-14 sm:top-16 z-50 bg-background md:hidden overflow-auto"
              onClick={closeMobileMenu}
            >
              <nav className="flex flex-col py-2 border-b shadow-lg">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="px-4 py-5 hover:bg-accent active:bg-accent/80"
                    onClick={closeMobileMenu}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          )}

          {/* Filters section */}
          <div className="ml-auto flex items-center">
            {/* Month filter */}
            <MonthFilter
              activeMonth={activeMonth}
              onMonthChange={onMonthChange}
            />
          </div>
        </div>
      </header>
    );
  }
);

Header.displayName = "Header";
