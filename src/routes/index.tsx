import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { CoursesCatalog } from "@/components/CoursesCatalog";
import { BookingSection } from "@/components/BookingSection";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Kridha — Become Job-Ready in 6 Months" },
      { name: "description", content: "Practical training in AI, Full Stack, Cloud, Data Science. 100% projects, placement support and industry certification. Admissions open for the 2026 batch." },
      { property: "og:title", content: "Kridha — Become Job-Ready in 6 Months" },
      { property: "og:description", content: "AI · Full Stack · Cloud · Data Science. Mentor-led, project-first, outcome-driven." },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <CoursesCatalog />
        <BookingSection />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
