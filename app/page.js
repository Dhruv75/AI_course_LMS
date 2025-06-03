"use client";
import Navbar from "./components/Navbar";
import CircularCursor from "./components/CircularCursor";

export default function Home() {
  return (
    <>
      <CircularCursor />
      <div className="cursor-none">
        <Navbar />
        <main className="container mx-auto px-6 py-8 min-h-screen">
          <section className="text-center py-20">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Welcome to Your App
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Experience the smooth, interactive cursor as you navigate through our beautiful interface.
            </p>
            <div className="flex gap-4 justify-center">
              <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
                Get Started
              </button>
              <button className="px-8 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors font-medium">
                Learn More
              </button>
            </div>
          </section>
          
          <section className="py-20">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 border border-border rounded-lg hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-3">Feature One</h3>
                <p className="text-muted-foreground">
                  Hover over elements to see the cursor react and provide visual feedback.
                </p>
              </div>
              <div className="p-6 border border-border rounded-lg hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-3">Feature Two</h3>
                <p className="text-muted-foreground">
                  The cursor follows your mouse with smooth GSAP animations.
                </p>
              </div>
              <div className="p-6 border border-border rounded-lg hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-3">Feature Three</h3>
                <p className="text-muted-foreground">
                  Click and drag to see the cursor scale and respond to interactions.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}