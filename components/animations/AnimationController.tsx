"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const AnimationController = () => {
  useEffect(() => {
    // 0. Check for Reduced Motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // 1. Background & Atmosphere Morphing
    const mainElement = document.querySelector("main");
    const sections = document.querySelectorAll("section");
    
    // Gradient configurations for each phase
    const atmospheres = [
      { bg: "#0c0a09", accent: "rgba(16, 185, 129, 0.1)" }, // Seedling - Dark Stone / Emerald
      { bg: "#1c1917", accent: "rgba(20, 184, 166, 0.15)" }, // Growth - Deep Stone / Teal
      { bg: "#064e3b", accent: "rgba(52, 211, 153, 0.2)" },  // Forest - Emerald Green
      { bg: "#022c22", accent: "rgba(245, 158, 11, 0.1)" },  // Bloom - Deep Teal / Amber
      { bg: "#0c0a09", accent: "rgba(16, 185, 129, 0.2)" },  // Ecosystem - Finale
    ];

    sections.forEach((section, i) => {
      const config = atmospheres[i] || atmospheres[0];
      
      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onEnter: () => {
          gsap.to(mainElement, {
            backgroundColor: config.bg,
            duration: 2,
            ease: "expo.out",
          });
          // Update parallax layer colors if they exist
          gsap.to(".parallax-bg div", {
            backgroundColor: config.accent,
            duration: 2,
            ease: "expo.out",
          });
        },
        onEnterBack: () => {
          gsap.to(mainElement, {
            backgroundColor: config.bg,
            duration: 2,
            ease: "expo.out",
          });
        },
      });
    });

    // 2. Master Text Stagger System
    const staggerContainers = document.querySelectorAll("[data-stagger]");
    staggerContainers.forEach((container) => {
      const items = container.querySelectorAll(".stagger-item");
      
      // Create a timeline for each container
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 75%",
          toggleActions: "play none none reverse",
        }
      });

      tl.from(items, {
        opacity: 0,
        y: 40,
        rotationX: -15,
        stagger: 0.15,
        duration: 1.2,
        ease: "expo.out",
        clearProps: "all",
      });
    });

    // 3. Cinematic Section Reveals
    const reveals = document.querySelectorAll("[data-reveal]");
    reveals.forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        scale: 0.95,
        filter: "blur(10px)",
        y: 60,
        duration: 1.5,
        ease: "expo.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    });

    // 4. Parallax Orchestration
    gsap.to(".parallax-bg div", {
      y: (i) => (i + 1) * -100,
      rotation: (i) => (i + 1) * 20,
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    // 5. Scroll-bound Vine Growth Indicators (UI)
    // (Optional: add a progress bar or similar if needed)

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return null;
};
