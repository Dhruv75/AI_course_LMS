"use client";
import Navbar from "./components/Navbar";
import CircularCursor from "./components/CircularCursor";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <CircularCursor />
      <div className="cursor-none">
        <Navbar />
        <main className="container mx-auto px-6 py-8 min-h-screen">
          <section className="text-center py-20">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              CourseCrafter
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Empowering educators and creators to design, launch, and share
              transformative courses with the world.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/workspace">
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-9 py-6 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-xl"
                  size="default"
                >
                  Start
                </Button>
              </Link>
            </div>
          </section>
          <section className="py-20">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 border border-border rounded-lg hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-3">GenAi Driven</h3>
                <p className="text-muted-foreground">
                  Automated Course Structure and Content Generation
                </p>
              </div>
              <div className="p-6 border border-border rounded-lg hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-3">
                  Personalized courses
                </h3>
                <p className="text-muted-foreground">
                  Personalized and Adaptive Learning Experiences
                </p>
              </div>
              <div className="p-6 border border-border rounded-lg hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-3">
                  Real Time Feedback
                </h3>
                <p className="text-muted-foreground">
                  Instant Assessment and Real-Time Feedback
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
