"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function CircularCursor() {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;

    // Set initial position off-screen
    gsap.set([cursor, follower], { 
      xPercent: -50, 
      yPercent: -50,
      scale: 0
    });

    let xTo = gsap.quickTo(cursor, "x", { duration: 0.2, ease: "power2.out" });
    let yTo = gsap.quickTo(cursor, "y", { duration: 0.2, ease: "power2.out" });
    
    let xFollowerTo = gsap.quickTo(follower, "x", { duration: 0.8, ease: "power2.out" });
    let yFollowerTo = gsap.quickTo(follower, "y", { duration: 0.8, ease: "power2.out" });

    const handleMouseMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
      xFollowerTo(e.clientX);
      yFollowerTo(e.clientY);
    };

    const handleMouseEnter = () => {
      gsap.to([cursor, follower], { 
        scale: 1, 
        duration: 0.3, 
        ease: "back.out(1.7)" 
      });
    };

    const handleMouseLeave = () => {
      gsap.to([cursor, follower], { 
        scale: 0, 
        duration: 0.3, 
        ease: "power2.inOut" 
      });
    };

    const handleMouseDown = () => {
      gsap.to(cursor, { 
        scale: 0.8, 
        duration: 0.1, 
        ease: "power2.out" 
      });
      gsap.to(follower, { 
        scale: 1.2, 
        duration: 0.1, 
        ease: "power2.out" 
      });
    };

    const handleMouseUp = () => {
      gsap.to(cursor, { 
        scale: 1, 
        duration: 0.2, 
        ease: "back.out(1.7)" 
      });
      gsap.to(follower, { 
        scale: 1, 
        duration: 0.2, 
        ease: "back.out(1.7)" 
      });
    };

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    // Cleanup
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <>
      {/* Main cursor dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 bg-black rounded-full pointer-events-none z-[9999]"
        style={{ 
          transform: 'translate(-50%, -50%)',
          willChange: 'transform'
        }}
      />
      
      {/* Follower circle */}
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-8 h-8 border-2 border-black/60 rounded-full pointer-events-none z-[9998]"
        style={{ 
          transform: 'translate(-50%, -50%)',
          willChange: 'transform'
        }}
      />
    </>
  );
}