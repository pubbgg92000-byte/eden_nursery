"use client";

import { useEffect, useRef, useState } from "react";
import { useStore } from "@/store/useStore";

export function AmbientAudioToggle() {
  const scrollProgress = useStore((state) => state.scrollProgress);
  const [enabled, setEnabled] = useState(false);
  const [preferred, setPreferred] = useState(false);
  const ambienceRef = useRef<HTMLAudioElement | null>(null);
  const windRef = useRef<HTMLAudioElement | null>(null);
  const leavesRef = useRef<HTMLAudioElement | null>(null);
  const birdsRef = useRef<HTMLAudioElement | null>(null);
  const bloomRef = useRef<HTMLAudioElement | null>(null);
  const previousProgress = useRef(0);

  useEffect(() => {
    setPreferred(window.localStorage.getItem("eden-audio-enabled") === "true");
    return () => {
      ambienceRef.current?.pause();
      windRef.current?.pause();
      leavesRef.current?.pause();
      birdsRef.current?.pause();
      bloomRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      ambienceRef.current?.pause();
      windRef.current?.pause();
      return;
    }
    const ambience = ambienceRef.current ?? new Audio("/audio/forest-ambience.m4a");
    const wind = windRef.current ?? new Audio("/audio/wind.m4a");
    const leaves = leavesRef.current ?? new Audio("/audio/leaves.m4a");
    const birds = birdsRef.current ?? new Audio("/audio/birds.m4a");
    const bloom = bloomRef.current ?? new Audio("/audio/bloom.m4a");
    ambienceRef.current = ambience;
    windRef.current = wind;
    leavesRef.current = leaves;
    birdsRef.current = birds;
    bloomRef.current = bloom;
    ambience.loop = true;
    wind.loop = true;
    leaves.loop = true;
    birds.loop = true;
    ambience.volume = 0.08;
    wind.volume = 0.03;
    leaves.volume = 0.015;
    birds.volume = 0.008;
    void ambience.play();
    void wind.play();
    void leaves.play();
    void birds.play();
  }, [enabled]);

  useEffect(() => {
    if (enabled) {
      if (ambienceRef.current) ambienceRef.current.volume = 0.06 + scrollProgress * 0.04;
      if (windRef.current) windRef.current.volume = 0.02 + scrollProgress * 0.045;
      if (leavesRef.current) leavesRef.current.volume = 0.01 + scrollProgress * 0.018;
      if (birdsRef.current) birdsRef.current.volume = scrollProgress > 0.48 ? 0.014 : 0.006;
      if (scrollProgress >= 0.57 && previousProgress.current < 0.57 && bloomRef.current) {
        bloomRef.current.volume = 0.12;
        bloomRef.current.currentTime = 0;
        void bloomRef.current.play();
      }
    }
    previousProgress.current = scrollProgress;
  }, [enabled, scrollProgress]);

  function toggleAudio() {
    if (!enabled && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const nextEnabled = !enabled;
    setPreferred(nextEnabled);
    window.localStorage.setItem("eden-audio-enabled", String(nextEnabled));
    setEnabled((value) => !value);
  }

  return (
    <button type="button" aria-pressed={enabled} aria-label={enabled ? "Mute ambient forest audio" : "Enable ambient forest audio"} onClick={toggleAudio} className="rounded-full border border-white/20 px-3 py-2 text-xs font-bold text-white/75 transition hover:border-emerald-400 hover:text-white">
      {enabled ? "Sound On" : preferred ? "Resume Sound" : "Sound Off"}
    </button>
  );
}
