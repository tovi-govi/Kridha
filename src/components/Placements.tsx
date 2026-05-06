import { BadgeIndianRupee, Building2 } from "lucide-react";

const placed = [
  { name: "Ravi", company: "TCS", salary: "₹4.5 LPA" },
  { name: "Sneha", company: "Infosys", salary: "₹5.2 LPA" },
  { name: "Arjun", company: "Wipro", salary: "₹4.8 LPA" },
];

const companies = ["TCS", "Infosys", "Wipro", "Cognizant", "HCL"];

export function Placements() {
  return (
    <section id="placements" className="bg-primary py-16 text-white lg:py-20" style={{ colorScheme: "normal" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-[0.22em] text-accent">Placements</span>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl lg:text-5xl">Student success that builds trust fast</h2>
            <p className="mt-4 max-w-xl text-white/70">Showcase placed students, company names and salary badges clearly so visitors understand the outcome.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {companies.map((c) => (
              <div key={c} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-center text-sm font-extrabold text-white/85">{c}</div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {placed.map((p) => (
            <div key={p.name} className="rounded-3xl border border-white/10 bg-white p-6 text-primary shadow-glow">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-accent text-2xl">👨‍🎓</div>
                <div>
                  <h3 className="text-xl font-extrabold">{p.name}</h3>
                  <div className="mt-1 flex items-center gap-2 text-sm font-bold text-muted-foreground"><Building2 className="h-4 w-4" /> {p.company}</div>
                </div>
              </div>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-extrabold text-emerald-700">
                <BadgeIndianRupee className="h-4 w-4" /> {p.salary}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
