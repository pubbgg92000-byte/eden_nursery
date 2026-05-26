"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const atmospheres = ["#090f0c", "#101c16", "#062a20", "#05251e", "#08120e"];

export function AnimationController() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      document.querySelectorAll<HTMLElement>("[data-phase]").forEach((section, index) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          onToggle: ({ isActive }) => {
            if (isActive) gsap.to("[data-cinematic-root]", { backgroundColor: atmospheres[index] ?? atmospheres[0], duration: 1.2, ease: "power3.out" });
          },
        });
      });
      document.querySelectorAll("[data-stagger]").forEach((container) => {
        gsap.from(container.querySelectorAll(".stagger-item"), {
          opacity: 0,
          y: 36,
          stagger: 0.12,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: container, start: "top 78%", toggleActions: "play none none reverse" },
        });
      });
      gsap.to(".parallax-orb", {
        y: -140,
        ease: "none",
        scrollTrigger: { trigger: "[data-cinematic-root]", start: "top top", end: "bottom bottom", scrub: true },
      });
    });
    return () => context.revert();
  }, []);
  return null;
}
