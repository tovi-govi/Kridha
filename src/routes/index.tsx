import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { CoursesCatalog } from "@/components/CoursesCatalog";
import { AboutUs } from "@/components/AboutUs";
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
        <CoursesCatalog />
        <AboutUs />
        <BookingSection />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
