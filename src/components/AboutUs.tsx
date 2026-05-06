import { GraduationCap, Briefcase, Globe, Code2 } from "lucide-react";

export function AboutUs() {
  return (
    <section id="about" className="py-16 lg:py-20 bg-gradient-to-b from-background via-secondary/30 to-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-12">
          <span className="text-xs font-extrabold uppercase tracking-[0.22em] text-emerald-600">About Us</span>
          <h2 className="mt-3 text-3xl font-extrabold text-primary sm:text-4xl lg:text-5xl">
            Who We Are
          </h2>
        </div>

        {/* Main Description */}
        <div className="mx-auto max-w-4xl mb-16">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-soft">
            <p className="text-lg text-muted-foreground leading-relaxed">
              <span className="font-extrabold text-primary">Kridha Software Solutions Pvt Ltd</span> is a dynamic and innovation-driven company focused on empowering individuals and businesses through technology, skill development, and career-oriented solutions.
            </p>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              We specialize in delivering high-quality training programs, professional certification courses, IT staffing solutions, job placement assistance, and overseas consultancy services. Our mission is to bridge the gap between education and industry by equipping students and professionals with the skills and opportunities needed to succeed in today's competitive world.
            </p>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              At Kridha, we believe in creating real career growth through practical learning, industry exposure, and personalized guidance. With a strong commitment to excellence, innovation, and customer success, we aim to become a trusted partner for career development and digital transformation.
            </p>
          </div>
        </div>

        {/* Our Services */}
        <div className="mb-16">
          <h3 className="text-2xl font-extrabold text-primary mb-8 text-center">Our Services</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <ServiceCard
              icon={GraduationCap}
              title="Skill Development & Certification Programs"
              emoji="🎓"
            />
            <ServiceCard
              icon={Briefcase}
              title="Job Placement Assistance"
              emoji="💼"
            />
            <ServiceCard
              icon={Globe}
              title="Overseas Consultancy Services"
              emoji="🌍"
            />
            <ServiceCard
              icon={Code2}
              title="IT Staffing Solutions"
              emoji="💻"
            />
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-soft hover:shadow-glow transition">
            <h4 className="text-2xl font-extrabold text-primary mb-4">Our Vision</h4>
            <p className="text-lg text-muted-foreground leading-relaxed">
              To empower people with knowledge, technology, and global opportunities for a successful future.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-8 shadow-soft hover:shadow-glow transition">
            <h4 className="text-2xl font-extrabold text-primary mb-4">Our Mission</h4>
            <p className="text-lg text-muted-foreground leading-relaxed">
              To provide industry-relevant training, reliable staffing solutions, and career guidance that help individuals and organizations achieve long-term success.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ icon: Icon, title, emoji }: { icon: React.ElementType; title: string; emoji: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft hover:shadow-glow hover:-translate-y-1 transition text-center">
      <div className="text-4xl mb-3">{emoji}</div>
      <Icon className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
      <p className="font-extrabold text-primary leading-snug">{title}</p>
    </div>
  );
}
