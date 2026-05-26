"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useStore } from "@/store/useStore";

gsap.registerPlugin(ScrollTrigger);

export const ScrollManager = () => {
  const setScrollProgress = useStore((state) => state.setScrollProgress);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      },
    });

    return () => {
      trigger.kill();
    };
  }, [setScrollProgress]);

  return null;
};
