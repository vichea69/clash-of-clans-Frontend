import { forwardRef } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { SORT_OPTIONS } from "../Base";

interface HeaderProps {
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  activeSort: (typeof SORT_OPTIONS)[0];
  handleSortChange: (option: (typeof SORT_OPTIONS)[0]) => void;
}

export const Header = forwardRef<HTMLDivElement, HeaderProps>(
  (
    {
      mobileMenuOpen,
      toggleMobileMenu,
      closeMobileMenu,
      activeSort,
      handleSortChange,
    },
    ref
  ) => {
    // Navigation links data
    const navLinks = [
      { href: "#", label: "Components" },
      { href: "#", label: "Templates" },
      { href: "#", label: "Categories" },
      { href: "#", label: "Design Engineers" },
      { href: "#", label: "Pro" },
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

          {/* Sort dropdown */}
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
                  {SORT_OPTIONS.map((option) => (
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
    );
  }
);

Header.displayName = "Header";
