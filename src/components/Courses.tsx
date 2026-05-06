import { BrainCircuit, Cloud, Code2, Layers, ShieldCheck } from "lucide-react";

type Course = {
  title: string;
  duration: string;
  tools: string;
  salary: string;
  icon: React.ElementType;
  highlight?: boolean;
};

const courses: Course[] = [
  { title: "Full Stack Developer", duration: "6 Months", tools: "React + Node", salary: "₹4–10 LPA", icon: Layers, highlight: true },
  { title: "Python Developer", duration: "6 Months", tools: "Python + SQL", salary: "₹3–8 LPA", icon: Code2 },
  { title: "Cloud & DevOps", duration: "6 Months", tools: "AWS + Docker", salary: "₹5–12 LPA", icon: Cloud, highlight: true },
  { title: "AI & Data Science", duration: "6 Months", tools: "Python + ML", salary: "₹5–14 LPA", icon: BrainCircuit },
  { title: "Cyber Security", duration: "6 Months", tools: "Linux + Networks", salary: "₹4–11 LPA", icon: ShieldCheck },
];

export function Courses() {
  return (
    <section id="courses" className="py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-extrabold uppercase tracking-[0.22em] text-emerald-600">Courses</span>
          <h2 className="mt-3 text-3xl font-extrabold text-primary sm:text-4xl lg:text-5xl">Choose a job-ready career track</h2>
          <p className="mt-4 text-muted-foreground">Each course is packed with tools, projects and salary-oriented placement preparation.</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {courses.map(({ title, duration, tools, salary, icon: Icon, highlight }) => (
            <div key={title} className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-glow">
              {highlight && <div className="absolute right-4 top-4 rounded-full bg-accent px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-primary">Popular</div>}
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-accent"><Icon className="h-7 w-7" /></div>
              <h3 className="mt-5 text-2xl font-extrabold text-primary">{title}</h3>
              <div className="mt-5 space-y-3 text-sm">
                <Row label="Duration" value={duration} />
                <Row label="Tools" value={tools} />
                <Row label="Salary Range" value={salary} strong />
              </div>
              <a href="#book" className="mt-6 inline-flex w-full justify-center rounded-full bg-primary px-5 py-3 font-extrabold text-white transition hover:bg-primary/90">
                Get Free Demo
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-secondary px-4 py-3">
      <span className="font-semibold text-muted-foreground">{label}</span>
      <span className={`text-right font-extrabold ${strong ? "text-emerald-600" : "text-primary"}`}>{value}</span>
    </div>
  );
}
