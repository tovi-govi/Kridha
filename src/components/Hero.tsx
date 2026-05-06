import { site } from "@/lib/site";
import { ArrowRight, Laptop, PlayCircle, UserRoundCheck } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary text-white" style={{ colorScheme: "normal" }}>
      <div className="absolute inset-0 opacity-15 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:30px_30px]" />
      <div className="absolute -right-20 top-24 h-48 w-48 sm:h-72 sm:w-72 rounded-full bg-accent/25 blur-3xl" />
      <div className="absolute -left-20 sm:-left-24 bottom-0 h-56 w-56 sm:h-80 sm:w-80 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-6 sm:gap-10 px-3 sm:px-5 md:py-20 py-12 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:px-8 lg:py-24">
        <div>
          <h1 className="mt-3 sm:mt-5 max-w-3xl text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold leading-tight sm:leading-[1.05]">
            🚀 Become Job-Ready in <span className="text-accent">6 Months</span>
          </h1>
          <p className="mt-3 sm:mt-5 max-w-xl text-sm sm:text-lg font-medium text-white/82 md:text-xl">
            Learn • Certify • Get Placed • Go Abroad
          </p>
          <p className="mt-2 max-w-xl text-xs sm:text-base font-medium text-accent/90">
            🌍 US • UK • Australia • New Zealand • Europe
          </p>
          <p className="mt-3 sm:mt-4 max-w-xl text-xs sm:text-base text-white/70 leading-relaxed">
            Practical training, real-time projects, interview preparation and career support from Kridha Software Solutions Private Limited.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col gap-2 sm:gap-3 sm:flex-row">
            <a href="#book" className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 sm:px-7 py-3 sm:py-4 text-xs sm:text-base font-extrabold text-primary shadow-glow transition hover:scale-[1.03] active:scale-95 w-full sm:w-auto">
              Book Free Demo <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-lg">
          <div className="absolute inset-0 rounded-3xl sm:rounded-[2.2rem] bg-accent/25 blur-3xl" />
          <div className="relative rounded-2xl sm:rounded-[2rem] border border-white/15 bg-white/10 p-4 sm:p-5 shadow-glow backdrop-blur">
            <div className="rounded-xl sm:rounded-[1.5rem] bg-white p-3 sm:p-4 text-primary">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-extrabold text-sm"><Laptop className="h-4 w-4 sm:h-5 sm:w-5" /> Live Project Class</div>
                <span className="rounded-full bg-accent/20 px-2 sm:px-3 py-0.5 sm:py-1 text-[0.6rem] sm:text-xs font-extrabold text-emerald-700 flex-shrink-0">LIVE</span>
              </div>
              <div className="mt-4 sm:mt-5 grid gap-3 sm:gap-4 sm:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-xl sm:rounded-2xl bg-primary p-3 sm:p-5 text-center text-white">
                  <div className="mx-auto grid h-20 w-20 sm:h-24 sm:w-24 place-items-center rounded-full bg-accent text-4xl sm:text-5xl">🎓</div>
                  <p className="mt-3 sm:mt-4 text-xs sm:text-sm font-bold leading-tight">Student + Laptop Visual</p>
                  <p className="mt-1 text-[0.65rem] sm:text-xs text-white/70">Mobile-first, fast.</p>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  {["React + Node", "Python + AWS", "Interview Training"].map((x) => (
                    <div key={x} className="flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-2xl border border-border p-2 sm:p-3">
                      <UserRoundCheck className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-bold leading-tight">{x}</span>
                    </div>
                  ))}
                  <div className="rounded-lg sm:rounded-2xl bg-primary p-3 sm:p-4 text-white">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-bold"><PlayCircle className="h-3 w-3 sm:h-4 sm:w-4 text-accent flex-shrink-0" /> Demo class available</div>
                    <div className="mt-2 text-xl sm:text-3xl font-extrabold text-accent">₹{site.feeINR.toLocaleString("en-IN")}</div>
                    <div className="text-[0.65rem] sm:text-xs text-white/70">Limited seats · EMI available</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
