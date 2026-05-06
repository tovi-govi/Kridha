import { site } from "@/lib/site";
import { Flame, Timer, Wallet } from "lucide-react";

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-4 py-16 sm:px-5 lg:px-8 lg:py-20">
      <div className="overflow-hidden rounded-[2rem] bg-primary text-white shadow-glow" style={{ colorScheme: "normal" }}>
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-12 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-primary">
              <Flame className="h-4 w-4" /> Limited Seats Offer
            </span>
            <h2 className="mt-5 text-3xl font-extrabold sm:text-4xl lg:text-5xl">Start your 6-month job-ready program at a launch price</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4">
                <div className="text-sm text-white/60 line-through">₹{site.originalFeeINR.toLocaleString("en-IN")}</div>
                <div className="text-4xl font-extrabold text-accent">🔥 ₹{site.feeINR.toLocaleString("en-IN")}</div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Badge icon={<Wallet className="h-5 w-5" />} text="EMI Available" />
                <Badge icon={<Timer className="h-5 w-5" />} text="Limited Seats" />
              </div>
            </div>
          </div>
          <div className="rounded-3xl bg-white p-6 text-primary">
            <div className="text-sm font-bold text-muted-foreground">What you get</div>
            <ul className="mt-4 space-y-3 text-sm font-bold">
              {['Live sessions', 'Real-time projects', 'Interview training', 'Placement support'].map((x) => (
                <li key={x} className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-accent" /> {x}</li>
              ))}
            </ul>
            <a href="#book" className="mt-6 inline-flex w-full justify-center rounded-full bg-accent px-5 py-4 font-extrabold text-primary">
              Claim Offer & Book Demo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-extrabold text-white">{icon}{text}</div>;
}
