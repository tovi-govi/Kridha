import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
    <motion.header
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-40 border-b border-border bg-white/90 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-3 sm:h-16 sm:px-5 lg:px-8">
        <Link to="/" className="flex flex-shrink-0 items-center">
          <Logo className="h-14 w-auto max-w-[220px] sm:h-16 sm:max-w-[260px]" variant="navbar" />
        </Link>

        <nav className="hidden flex-1 items-center justify-end gap-5 md:flex lg:gap-7">
          {links.map((l, idx) => (
            <motion.div
              key={l.href}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 + idx * 0.04 }}
              whileHover={{ y: -1 }}
            >
              {l.href.startsWith("#") ? (
                <button
                  onClick={() => handleNavClick(l.href)}
                  className="whitespace-nowrap text-left text-xs font-semibold text-muted-foreground transition hover:text-primary sm:text-sm"
                >
                  {l.label}
                </button>
              ) : (
                <Link
                  to={l.href}
                  className="whitespace-nowrap text-xs font-semibold text-muted-foreground transition hover:text-primary sm:text-sm"
                >
                  {l.label}
                </Link>
              )}
            </motion.div>
          ))}
          <motion.button
            onClick={() => handleNavClick("#book")}
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.96 }}
            className="flex-shrink-0 rounded-full bg-accent px-4 py-2 text-xs font-extrabold text-primary shadow-soft transition sm:px-5 sm:py-2.5 sm:text-sm"
          >
            Enroll Now
          </motion.button>
        </nav>

        <motion.button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          whileTap={{ scale: 0.92 }}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-border p-2 text-primary md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="max-h-[calc(100vh-3.5rem)] overflow-y-auto border-t border-border bg-white md:hidden"
          >
            <div className="flex flex-col gap-3 px-3 py-4 sm:gap-4 sm:px-5 sm:py-5">
              {links.map((l, idx) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                >
                  {l.href.startsWith("#") ? (
                    <button
                      onClick={() => handleNavClick(l.href)}
                      className="w-full rounded-lg px-2 py-2 text-left text-sm font-semibold text-primary transition hover:bg-slate-100"
                    >
                      {l.label}
                    </button>
                  ) : (
                    <Link
                      to={l.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-2 py-2 text-sm font-semibold text-primary transition hover:bg-slate-100"
                    >
                      {l.label}
                    </Link>
                  )}
                </motion.div>
              ))}
              <motion.button
                onClick={() => handleNavClick("#book")}
                whileTap={{ scale: 0.96 }}
                className="mt-2 w-full rounded-full bg-accent px-5 py-3 text-center font-extrabold text-primary transition"
              >
                Enroll Now
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
