import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
  { name: "Tests", href: "https://addyalago.github.io/Beautiful-portfolio/" },
  {
    name: "Resume",
    href: "https://drive.google.com/file/d/1Ttln3b5_RWDozxSC51wLPDfIU-_OkRGa/view?usp=sharing",
  },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Track scroll to style navbar
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock background scroll when mobile menu is open
  useEffect(() => {
    const root = document.documentElement; // or document.body
    if (isMenuOpen) root.style.overflow = "hidden";
    else root.style.overflow = "";
    return () => {
      root.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        "h-16 md:h-20", // fixed height for stable layout
        isScrolled
          ? "py-3 bg-background/80 backdrop-blur-md shadow-xs"
          : "py-5"
      )}
      data-testid="site-header"
    >
      <div className="container h-full flex items-center justify-between">
        {/* Brand */}
        <a
          className="text-xl font-bold text-primary flex items-center"
          href="#home"
          data-testid="nav-home"
        >
          <span className="relative z-10">
            <span className="text-glow text-foreground"> Addy Alago </span>{" "}
            Portfolio
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex space-x-8" data-testid="desktop-nav">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={cn(
                "transition-colors duration-300",
                item.name === "Resume"
                  ? "text-sky-500 font-semibold hover:text-blue-800"
                  : "text-foreground/80 hover:text-primary"
              )}
              target={item.name === "Resume" ? "_blank" : "_self"}
              rel={item.name === "Resume" ? "noopener noreferrer" : undefined}
              data-testid={`nav-${item.name.toLowerCase()}`}
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setIsMenuOpen((v) => !v)}
          className="md:hidden p-2 text-foreground z-50"
          aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
          data-testid="nav-toggle"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile full-screen overlay + its own close button */}
        <div
          id="mobile-nav"
          className={cn(
            "fixed inset-0 z-50 overflow-y-auto bg-background/95 backdrop-blur-md",
            "md:hidden transition-opacity duration-300",
            isMenuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          )}
          data-testid="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-hidden={!isMenuOpen}
        >
          {/* Close button inside overlay so it stays above */}
          <button
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close Menu"
            className="fixed top-4 right-4 rounded-lg border border-border/50 bg-background/80 p-2 shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-primary/60"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="min-h-dvh flex flex-col items-center justify-center p-6">
            <nav aria-label="Mobile" className="flex flex-col gap-6 text-xl w-full max-w-sm">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-foreground/80 hover:text-primary transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                  data-testid={`nav-${item.name.toLowerCase()}`}
                  target={item.name === "Resume" ? "_blank" : "_self"}
                  rel={item.name === "Resume" ? "noopener noreferrer" : undefined}
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </nav>
  );
};
