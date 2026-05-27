import { GraduationCap, Briefcase, Globe, Code2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal, softHover } from "@/components/Motion";

export function AboutUs() {
  const services = [
    {
      icon: GraduationCap,
      title: "Skill Development",
      desc: "Career-focused technical training with practical tasks and mentor guidance.",
    },
    {
      icon: Briefcase,
      title: "Job Placements",
      desc: "Resume support, interview practice and company opportunity guidance.",
    },
    {
      icon: Globe,
      title: "Overseas Consultancy",
      desc: "Guidance for abroad study and career pathways with clear next steps.",
    },
    {
      icon: Code2,
      title: "IT Staffing",
      desc: "Talent support for companies looking for trained and job-ready candidates.",
    },
  ];

  const why = ["Industry Trainers", "Real Projects", "Placement Support", "Interview Training"];

  return (
    <section
      id="about"
      className="py-16 lg:py-20 bg-gradient-to-b from-background via-secondary/30 to-background"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8">
        {/* Header */}
        <Reveal className="mx-auto max-w-3xl text-center mb-12">
          <span className="text-xs font-extrabold uppercase tracking-[0.22em] text-emerald-600">
            About Us
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-primary sm:text-4xl lg:text-5xl">
            Who We Are
          </h2>
        </Reveal>

        {/* Main Description */}
        <Reveal className="mx-auto max-w-4xl mb-16">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-soft">
            <p className="text-lg text-muted-foreground leading-relaxed">
              <span className="font-extrabold text-primary">Kridha Software Solutions Pvt Ltd</span>{" "}
              is a dynamic and innovation-driven company focused on empowering individuals and
              businesses through technology, skill development, and career-oriented solutions.
            </p>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              We specialize in delivering high-quality training programs, professional certification
              courses, IT staffing solutions, job placement assistance, and overseas consultancy
              services. Our mission is to bridge the gap between education and industry by equipping
              students and professionals with the skills and opportunities needed to succeed in
              today's competitive world.
            </p>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              At Kridha, we believe in creating real career growth through practical learning,
              industry exposure, and personalized guidance. With a strong commitment to excellence,
              innovation, and customer success, we aim to become a trusted partner for career
              development and digital transformation.
            </p>
          </div>
        </Reveal>

        {/* Our Services */}
        <div className="mb-16">
          <Reveal>
            <h3 className="text-2xl font-extrabold text-primary mb-8 text-center">
              Everything Kridha Offers in One Place
            </h3>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map(({ icon: Icon, title, desc }, idx) => (
              <Reveal key={title} delay={idx * 0.06} className="h-full">
                <motion.div
                  whileHover={softHover}
                  className="group h-full rounded-3xl border border-border bg-card p-6 shadow-soft transition duration-200 hover:shadow-glow"
                >
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-accent transition group-hover:bg-accent group-hover:text-primary">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h4 className="mt-5 text-xl font-extrabold text-primary">{title}</h4>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Built for students section */}
        <Reveal className="bg-secondary/45 rounded-3xl py-12 px-8 mb-16">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-[0.22em] text-emerald-600">
                Why Kridha
              </span>
              <h3 className="mt-3 text-3xl font-extrabold text-primary sm:text-4xl">
                Built for students who want outcomes, not just classes
              </h3>
              <p className="mt-4 text-muted-foreground">
                The program keeps the core promise simple: learn properly, build proof, practice
                interviews and get placement support.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {why.map((x, idx) => (
                <motion.div
                  key={x}
                  initial={{ opacity: 0, x: 18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.45, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ x: 6 }}
                  className="flex items-center gap-3 rounded-2xl bg-white p-5 font-extrabold text-primary shadow-soft"
                >
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-600" /> {x}
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Vision & Mission */}
        <div className="grid gap-8 md:grid-cols-2">
          <Reveal>
            <motion.div
              whileHover={softHover}
              className="rounded-2xl border border-border bg-card p-8 shadow-soft hover:shadow-glow transition"
            >
              <h4 className="text-2xl font-extrabold text-primary mb-4">Our Vision</h4>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To empower people with knowledge, technology, and global opportunities for a
                successful future.
              </p>
            </motion.div>
          </Reveal>
          <Reveal delay={0.08}>
            <motion.div
              whileHover={softHover}
              className="rounded-2xl border border-border bg-card p-8 shadow-soft hover:shadow-glow transition"
            >
              <h4 className="text-2xl font-extrabold text-primary mb-4">Our Mission</h4>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To provide industry-relevant training, reliable staffing solutions, and career
                guidance that help individuals and organizations achieve long-term success.
              </p>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
