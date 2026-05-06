import { createFileRoute } from "@tanstack/react-router";
import { CoursesPage } from "@/components/CoursesPage";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";

export const Route = createFileRoute("/courses")({
  component: CourseRoute,
  head: () => ({
    meta: [
      { title: "Our Courses — Kridha Software Solutions" },
      { name: "description", content: "Explore our comprehensive course offerings in Full Stack, AI & Data Science, Cloud & DevOps, Cyber Security and more." },
    ],
  }),
});

function CourseRoute() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <CoursesPage />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}