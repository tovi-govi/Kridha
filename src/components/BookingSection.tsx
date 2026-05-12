import { useState, type FormEvent } from "react";
import emailjs from "@emailjs/browser";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

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
          EMAILJS_PUBLIC_KEY
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
    <section id="book" className="py-16 lg:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-[0.22em] text-emerald-600">
              Free Career Demo
            </span>

            <h2 className="mt-3 text-3xl font-extrabold text-primary sm:text-4xl lg:text-5xl">
              Start your job-ready journey today
            </h2>

            <p className="mt-4 text-muted-foreground">
              Fill in your details and our team will contact you for a free demo,
              course guidance, and placement roadmap.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <span className="text-emerald-600">✅</span> EMI Available
              </div>

              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <span className="text-emerald-600">✅</span> Limited Seats
              </div>

              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <span className="text-emerald-600">✅</span> Placement Support
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xl font-extrabold text-primary">
              Book Free Demo
            </h3>

            {submitted && (
              <div className="rounded-lg bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 border border-emerald-200">
                ✅ Booking submitted successfully!
              </div>
            )}

            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-sm font-semibold text-red-700 border border-red-200">
                ❌ {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Name
              </label>

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
              <label className="block text-sm font-semibold text-primary mb-2">
                Email
              </label>

              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="yourmail@gmail.com"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Phone
              </label>

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
              <label className="block text-sm font-semibold text-primary mb-2">
                Course
              </label>

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
              <label className="block text-sm font-semibold text-primary mb-2">
                Notes
              </label>

              <textarea
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                placeholder="Any message or doubt?"
                rows={3}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-primary px-6 py-3 font-extrabold text-white transition hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Get Free Demo"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}