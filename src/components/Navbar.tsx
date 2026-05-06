import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/Logo";

const links = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Services" },
  { href: "/placement-process", label: "Placement Process" },
  { href: "#about", label: "About Us" },
  { href: "#book", label: "Demo" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavClick = (href: string) => {
    if (href.startsWith("#")) {
      navigate({ to: "/" });
      setTimeout(() => {
        const element = document.querySelector(href);
        element?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-3 sm:px-5 lg:px-8 gap-3">
        <Link to="/" className="flex items-center flex-shrink-0">
          <Logo className="h-9 sm:h-11 w-auto max-w-[180px] sm:max-w-[210px]" />
        </Link>

        <nav className="hidden items-center gap-5 lg:gap-7 md:flex flex-1 justify-end">
          {links.map((l) => (
            l.href.startsWith("#") ? (
              <button
                key={l.href}
                onClick={() => handleNavClick(l.href)}
                className="text-xs sm:text-sm font-semibold text-muted-foreground transition hover:text-primary text-left whitespace-nowrap"
              >
                {l.label}
              </button>
            ) : (
              <Link key={l.href} to={l.href} className="text-xs sm:text-sm font-semibold text-muted-foreground transition hover:text-primary whitespace-nowrap">
                {l.label}
              </Link>
            )
          ))}
          <button
            onClick={() => handleNavClick("#book")}
            className="rounded-full bg-accent px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-extrabold text-primary shadow-soft transition hover:scale-[1.03] active:scale-95 flex-shrink-0"
          >
            Enroll Now
          </button>
        </nav>

        <button onClick={() => setOpen(!open)} aria-label="Toggle menu" className="md:hidden rounded-lg border border-border p-2 text-primary h-10 w-10 flex items-center justify-center flex-shrink-0">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-white md:hidden max-h-[calc(100vh-3.5rem)] overflow-y-auto">
          <div className="flex flex-col gap-3 px-3 py-4 sm:gap-4 sm:px-5 sm:py-5">
            {links.map((l) => (
              l.href.startsWith("#") ? (
                <button
                  key={l.href}
                  onClick={() => handleNavClick(l.href)}
                  className="font-semibold text-primary text-left text-sm py-2 px-2 rounded-lg hover:bg-slate-100 transition"
                >
                  {l.label}
                </button>
              ) : (
                <Link key={l.href} to={l.href} onClick={() => setOpen(false)} className="font-semibold text-primary text-sm py-2 px-2 rounded-lg hover:bg-slate-100 transition">
                  {l.label}
                </Link>
              )
            ))}
            <button
              onClick={() => handleNavClick("#book")}
              className="rounded-full bg-accent px-5 py-3 text-center font-extrabold text-primary w-full mt-2 active:scale-95 transition"
            >
              Enroll Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
