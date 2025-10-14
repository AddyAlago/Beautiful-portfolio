import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "My Career", href: "#career" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
  { name: "Tests", href: "https://addyalago.github.io/Beautiful-portfolio/" },
  {
    name: "Resume",
    href: "https://drive.google.com/file/d/1Ttln3b5_RWDozxSC51wLPDfIU-_OkRGa/view?usp=sharing",
  },
];

function MobileOverlay({ open, onClose }) {
  if (typeof document === "undefined") return null;

  // Lock body scroll when menu is open
  useEffect(() => {
    const body = document.body;
    if (open) {
      body.style.overflow = "hidden";
      body.style.touchAction = "none";
    } else {
      body.style.overflow = "";
      body.style.touchAction = "";
    }
    return () => {
      body.style.overflow = "";
      body.style.touchAction = "";
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div
      id="mobile-nav"
      className={cn(
        "fixed inset-0 z-[1000] overflow-y-auto bg-background/95 backdrop-blur-md touch-none",
        "transition-opacity duration-300",
        open
          ? "opacity-100 visible pointer-events-auto"
          : "opacity-0 invisible pointer-events-none"
      )}
      data-testid="mobile-nav"
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close Menu"
        className="fixed top-4 right-4 rounded-lg border border-border/50 bg-background/80 p-2 shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-primary/60"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Centered nav links */}
      <div className="min-h-dvh flex flex-col items-center justify-center p-6">
        <nav
          aria-label="Mobile"
          className="flex flex-col items-center gap-6 text-xl text-center"
        >
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-foreground/80 hover:text-primary transition-colors duration-300"
              onClick={onClose}
              data-testid={`nav-${item.name.toLowerCase()}`}
              target={item.name === "Resume" ? "_blank" : "_self"}
              rel={item.name === "Resume" ? "noopener noreferrer" : undefined}
            >
              {item.name}
            </a>
          ))}
        </nav>
      </div>
    </div>,
    document.body
  );
}

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = useMemo(() => () => setIsMenuOpen(false), []);

  return (
    <>
      <nav
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-all duration-300",
          "h-16 md:h-20",
          isScrolled ? "py-3 bg-background/80 backdrop-blur-md shadow-xs" : "py-5"
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
        </div>
      </nav>

      {/* Mobile menu portal */}
      <MobileOverlay open={isMenuOpen} onClose={closeMenu} />
    </>
  );
};
