import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { site, waLink } from "@/lib/site";
import { Logo } from "@/components/Logo";
import { Reveal } from "@/components/Motion";

export function Footer() {
  const handleNavClick = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer
      className="relative overflow-hidden bg-primary text-white"
      style={{ colorScheme: "normal" }}
    >
      <div className="pointer-events-none absolute -left-20 top-10 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute right-8 bottom-0 h-56 w-56 rounded-full bg-cyan-300/10 blur-3xl" />

      <Reveal className="relative mx-auto max-w-7xl px-4 py-12 sm:px-5 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <motion.div whileHover={{ y: -4 }}>
            <div className="inline-flex rounded-2xl bg-white p-3 shadow-lg shadow-black/10">
              <Logo className="h-11 w-auto max-w-[260px]" />
            </div>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/70">
              Learn, certify, get placed, and go abroad with Kridha Software Solutions Private
              Limited.
            </p>
          </motion.div>

          <div>
            <h3 className="font-extrabold">Quick Links</h3>
            <div className="mt-3 grid gap-2 text-sm text-white/70">
              <Link to="/" className="transition hover:translate-x-1 hover:text-white">
                Home
              </Link>
              <Link to="/courses" className="transition hover:translate-x-1 hover:text-white">
                Services
              </Link>
              <Link
                to="/placement-process"
                className="transition hover:translate-x-1 hover:text-white"
              >
                Placement Process
              </Link>
              <button
                onClick={() => handleNavClick("#about")}
                className="text-left transition hover:translate-x-1 hover:text-white"
              >
                About Us
              </button>
              <button
                onClick={() => handleNavClick("#book")}
                className="text-left transition hover:translate-x-1 hover:text-white"
              >
                Demo
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-extrabold">Contact</h3>
            <div className="mt-3 grid gap-2 text-sm text-white/70">
              <span>{site.phoneDisplay}</span>
              <a href={site.website} target="_blank" rel="noreferrer" className="hover:text-white">
                {site.websiteDisplay}
              </a>
              <motion.a
                href={waLink("Hi Kridha, I want course details.")}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.96 }}
                className="mt-2 inline-flex w-max rounded-full bg-accent px-5 py-2.5 font-extrabold text-primary"
              >
                WhatsApp Now
              </motion.a>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-white/55">
          © {new Date().getFullYear()} {site.name} Software Solutions Private Limited. All rights
          reserved.
        </div>
      </Reveal>
    </footer>
  );
}
