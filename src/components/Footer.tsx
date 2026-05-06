import { site, waLink } from "@/lib/site";
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="bg-primary text-white" style={{ colorScheme: "normal" }}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-5 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="inline-flex rounded-2xl bg-white p-3"><Logo className="h-11 w-auto max-w-[260px]" /></div>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/70">Learn • Certify • Get Placed • Go Abroad with Kridha Software Solutions Private Limited.</p>
          </div>
          <div>
            <h3 className="font-extrabold">Quick Links</h3>
            <div className="mt-3 grid gap-2 text-sm text-white/70">
              <a href="#services">Services</a><a href="#courses">Courses</a><a href="#placements">Placements</a><a href="#book">Book Demo</a>
            </div>
          </div>
          <div>
            <h3 className="font-extrabold">Contact</h3>
            <div className="mt-3 grid gap-2 text-sm text-white/70">
              <span>{site.phoneDisplay}</span>
              <span>{site.email}</span>
              <a href={waLink("Hi Kridha, I want course details.")} target="_blank" rel="noreferrer" className="mt-2 inline-flex w-max rounded-full bg-accent px-5 py-2.5 font-extrabold text-primary">WhatsApp Now</a>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-white/55">© {new Date().getFullYear()} {site.name} Software Solutions Private Limited. All rights reserved.</div>
      </div>
    </footer>
  );
}
