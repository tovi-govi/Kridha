import { BadgeCheck, BriefcaseBusiness, Building2, CheckCircle2, Globe2, GraduationCap, Star, UsersRound } from "lucide-react";

const trust = [
  { icon: UsersRound, value: "500+", label: "Students" },
  { icon: BriefcaseBusiness, value: "100+", label: "Placements" },
  { icon: Star, value: "4.8⭐", label: "Rating" },
  { icon: CheckCircle2, value: "Live", label: "Real-Time Projects" },
];

const services = [
  { icon: GraduationCap, title: "Skill Development", desc: "Career-focused technical training with practical tasks and mentor guidance." },
  { icon: BriefcaseBusiness, title: "Job Placements", desc: "Resume support, interview practice and company opportunity guidance." },
  { icon: Globe2, title: "Overseas Consultancy", desc: "Guidance for abroad study and career pathways with clear next steps." },
  { icon: Building2, title: "IT Staffing", desc: "Talent support for companies looking for trained and job-ready candidates." },
];

const why = ["Industry Trainers", "Real Projects", "Placement Support", "Interview Training"];

export function Features() {
  return (
    <>
      <section className="bg-primary py-5 text-white" style={{ colorScheme: "normal" }}>
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 sm:px-5 md:grid-cols-4 lg:px-8">
          {trust.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 p-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-primary"><Icon className="h-5 w-5" /></div>
              <div>
                <div className="text-xl font-extrabold">{value}</div>
                <div className="text-xs font-semibold text-white/65">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="services" className="mx-auto max-w-7xl px-4 py-16 sm:px-5 lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <span className="text-xs font-extrabold uppercase tracking-[0.22em] text-emerald-600">Services</span>
          <h2 className="mt-3 text-3xl font-extrabold text-primary sm:text-4xl lg:text-5xl">Everything Kridha offers in one place</h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="group rounded-3xl border border-border bg-card p-6 shadow-soft transition duration-200 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-glow">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-accent transition group-hover:bg-accent group-hover:text-primary">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="mt-5 text-xl font-extrabold text-primary">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="why" className="bg-secondary/45 py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:px-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-[0.22em] text-emerald-600">Why Kridha</span>
            <h2 className="mt-3 text-3xl font-extrabold text-primary sm:text-4xl lg:text-5xl">Built for students who want outcomes, not just classes</h2>
            <p className="mt-4 text-muted-foreground">The program keeps the core promise simple: learn properly, build proof, practice interviews and get placement support.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {why.map((x) => (
              <div key={x} className="flex items-center gap-3 rounded-2xl bg-white p-5 font-extrabold text-primary shadow-soft">
                <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-600" /> {x}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
