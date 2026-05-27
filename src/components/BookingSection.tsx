import { useState, type FormEvent } from "react";
import emailjs from "@emailjs/browser";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { auth, db } from "@/lib/firebase";
import { Reveal } from "@/components/Motion";

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "";
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "";
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "";

if (EMAILJS_PUBLIC_KEY) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

const COURSES = [
  "Full Stack Developer",
  "Python Developer",
  "AWS Cloud",
  "Data Analytics",
  "Digital Marketing",
  "Cloud & DevOps",
];

const demoHighlights = ["EMI Available", "Limited Seats", "Placement Support"];

export function BookingSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    course: COURSES[0],
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!form.name || !form.phone || !form.course) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, "bookings"), {
        name: form.name,
        email: form.email || "",
        phone: form.phone,
        course: form.course,
        message: form.message || "",
        checkedOut: false,
        uid: auth.currentUser?.uid || null,
        createdAt: serverTimestamp(),
      });

      if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            to_email: form.email,
            user_name: form.name,
            user_email: form.email,
            user_phone: form.phone,
            course_name: form.course,
            message: form.message,
          },
          EMAILJS_PUBLIC_KEY,
        );
      }

      setSubmitted(true);

      setForm({
        name: "",
        email: "",
        phone: "",
        course: COURSES[0],
        message: "",
      });

      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: unknown) {
      console.error("Booking error:", err);
      setError(err instanceof Error ? err.message : "Failed to submit booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="book" className="relative overflow-hidden bg-background py-16 lg:py-20">
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-8 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-5 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <span className="text-xs font-extrabold uppercase tracking-[0.22em] text-emerald-600">
              Free Career Demo
            </span>

            <h2 className="mt-3 text-3xl font-extrabold text-primary sm:text-4xl lg:text-5xl">
              Start your job-ready journey today
            </h2>

            <p className="mt-4 text-muted-foreground">
              Fill in your details and our team will contact you for a free demo, course guidance,
              and placement roadmap.
            </p>

            <div className="mt-6 space-y-3">
              {demoHighlights.map((item, idx) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.45, delay: 0.18 + idx * 0.07 }}
                  className="flex items-center gap-2 text-sm font-semibold text-primary"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  {item}
                </motion.div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <motion.form
              onSubmit={handleSubmit}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 230, damping: 24 }}
              className="relative space-y-4 overflow-hidden rounded-3xl border border-border/70 bg-card/95 p-5 shadow-soft backdrop-blur sm:p-7 hover:shadow-glow"
            >
              <div className="pointer-events-none absolute inset-x-8 top-0 h-1 rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-500 opacity-70" />
              <h3 className="text-xl font-extrabold text-primary">Book Free Demo</h3>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Booking submitted successfully!
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700"
                >
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </motion.div>
              )}

              <div>
                <label className="mb-2 block text-sm font-semibold text-primary">Name</label>

                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Your full name"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-primary">Email</label>

                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="yourmail@gmail.com"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-primary">Phone</label>

                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-primary">Course</label>

                <select
                  required
                  value={form.course}
                  onChange={(e) => update("course", e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {COURSES.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-primary">Notes</label>

                <textarea
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder="Any message or doubt?"
                  rows={3}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.97 }}
                className="w-full rounded-full bg-primary px-6 py-3 font-extrabold text-white transition hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Get Free Demo"}
              </motion.button>
            </motion.form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
