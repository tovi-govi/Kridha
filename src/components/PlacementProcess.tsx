import { Bookmark, Building2, FileText, Hammer, Mic, Target, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/Motion";

const steps = [
  {
    number: 1,
    title: "Register / Enroll",
    description:
      "Begin your journey with us. Quick enrollment process with flexible payment options.",
    icon: Bookmark,
    color: "text-emerald-300",
  },
  {
    number: 2,
    title: "Skill Training",
    description:
      "Intensive 6-month program with live projects, real-time problem solving, and industry mentors.",
    icon: Hammer,
    color: "text-cyan-300",
  },
  {
    number: 3,
    title: "Resume Preparation",
    description:
      "Professional resume crafting to highlight your skills, projects, and achievements effectively.",
    icon: FileText,
    color: "text-sky-300",
  },
  {
    number: 4,
    title: "Mock Interviews",
    description:
      "Practice interviews with industry experts to build confidence and perfect your communication.",
    icon: Mic,
    color: "text-violet-300",
  },
  {
    number: 5,
    title: "Company Interviews",
    description:
      "Direct placement assistance with top companies actively looking for trained candidates.",
    icon: Building2,
    color: "text-emerald-300",
  },
  {
    number: 6,
    title: "Job Offer",
    description: "Secure your dream job with competitive salary and growth opportunities.",
    icon: Target,
    color: "text-emerald-300",
  },
];

export function PlacementProcess() {
  return (
    <section
      className="relative overflow-hidden bg-slate-950 py-12 sm:py-16 lg:py-20"
      style={{ colorScheme: "normal" }}
    >
      <div className="pointer-events-none absolute left-1/2 top-24 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-3 sm:px-5 lg:px-8">
        <Reveal className="mb-8 max-w-2xl">
          <span className="text-xs font-extrabold uppercase tracking-[0.22em] text-emerald-400">
            Journey to Success
          </span>
          <h2 className="mt-3 text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
            Your Placement Process
          </h2>
          <p className="mt-3 text-xs text-slate-300 sm:mt-4 sm:text-sm">
            Follow our proven 6-step process to land your dream job
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;

            return (
              <Reveal key={step.number} delay={idx * 0.065} y={30}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 240, damping: 20 }}
                  className="group relative overflow-hidden rounded-2xl border border-slate-700/40 bg-slate-900/95 p-4 text-center shadow-[0_20px_60px_rgba(15,23,42,0.25)] sm:rounded-[32px] sm:p-6"
                >
                  <div className="absolute inset-x-4 top-0 h-1 rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-500 opacity-30 sm:inset-x-6" />
                  <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-400/10 blur-2xl" />

                  <div className="relative z-10 flex flex-col items-center justify-center gap-3 pt-4 sm:gap-5 sm:pt-6">
                    <div
                      className="relative flex h-20 w-20 items-center justify-center rounded-lg border border-emerald-400/20 bg-slate-950/95 p-3 shadow-[0_12px_40px_rgba(16,185,129,0.1)] transition duration-300 group-hover:scale-105 sm:h-28 sm:w-28 sm:rounded-[22px] sm:p-4"
                      style={{
                        clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                      }}
                    >
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-emerald-400/10 via-transparent to-cyan-400/10 opacity-80 blur-sm sm:rounded-[22px]" />
                      <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 shadow-lg shadow-emerald-500/20 sm:h-16 sm:w-16">
                        <Icon className={`h-10 w-10 ${step.color}`} />
                      </div>
                    </div>

                    <div className="space-y-2 px-1 sm:space-y-3 sm:px-2">
                      <span className="inline-flex rounded-full bg-emerald-500/10 px-2 py-0.5 text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-emerald-200 sm:px-3 sm:py-1 sm:text-[0.65rem] sm:tracking-[0.22em]">
                        Step {step.number}
                      </span>
                      <h3 className="text-base font-bold leading-snug text-white sm:text-lg md:text-xl">
                        {step.title}
                      </h3>
                      <p className="text-xs leading-5 text-slate-300 sm:text-sm sm:leading-6">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                </motion.div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.12} className="mt-12 sm:mt-16">
          <motion.div
            whileHover={{ y: -5 }}
            className="rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 p-5 text-center text-white shadow-[0_25px_90px_rgba(15,23,42,0.3)] ring-1 ring-white/10 sm:rounded-3xl sm:p-8 lg:p-12"
          >
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <Zap className="h-5 w-5 flex-shrink-0 text-emerald-400 sm:h-6 sm:w-6" />
              <h3 className="text-lg font-extrabold leading-snug sm:text-2xl md:text-3xl">
                Ready to start your journey?
              </h3>
            </div>
            <p className="mt-2 text-xs text-slate-300 sm:mt-3 sm:text-base">
              Join our next batch and become job-ready in 6 months
            </p>
            <motion.a
              href="#book"
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              className="touch-target mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-emerald-400 px-6 py-2.5 text-xs font-extrabold text-slate-950 shadow-lg shadow-emerald-500/20 transition duration-200 hover:bg-emerald-300 sm:mt-6 sm:px-8 sm:py-3 sm:text-sm"
            >
              Book Free Demo Today
            </motion.a>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
