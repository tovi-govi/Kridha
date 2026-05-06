import { Suspense, lazy } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import { BookingSection } from "@/components/BookingSection";

const PlacementProcess = lazy(async () => ({
  default: (await import("@/components/PlacementProcess")).PlacementProcess,
}));

export const Route = createFileRoute("/placement-process")({
  component: PlacementProcessPage,
  head: () => ({
    meta: [
      { title: "Placement Process — Kridha" },
      { name: "description", content: "Learn about our proven 6-step placement process: Register, Skill Training, Resume Preparation, Mock Interviews, Company Interviews, and Job Offer." },
    ],
  }),
});

function PlacementProcessPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="bg-primary py-12 text-white lg:py-16" style={{ colorScheme: "normal" }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8">
            <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl">
              Your Journey to Success
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-white/80">
              Our proven 6-step placement process ensures you're job-ready and placed with top companies
            </p>
          </div>
        </section>
        <Suspense fallback={<div className="min-h-[40rem] bg-background" />}>
          <PlacementProcess />
        </Suspense>
        <BookingSection />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
