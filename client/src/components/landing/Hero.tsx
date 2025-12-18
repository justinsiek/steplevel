"use client";

import React from "react";
import { motion } from "framer-motion";
import { Pipeline } from "./Pipeline";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[var(--background)] px-4 py-12 text-center">
      
      {/* Text Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 mx-auto max-w-4xl"
      >
        <h1 className="mb-6 text-4xl font-medium leading-tight tracking-tight text-[var(--foreground)] sm:text-5xl md:text-6xl">
          Optimize your AI agent <br className="hidden md:block" />
          at the step level.
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-[var(--accent-muted)] sm:text-xl">
          Trace agent execution, isolate inefficient steps, and safely deploy optimized behavior.
        </p>
      </motion.div>

      {/* Pipeline Visualization */}
      <div className="mt-12 w-full max-w-[1600px] xl:-mx-20">
        <Pipeline />
      </div>

      {/* CTA */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="mt-16"
      >
        <button className="group flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-6 py-2.5 text-sm font-medium text-[var(--foreground)] transition-all hover:border-[var(--accent)] hover:shadow-sm">
          Book a demo
          <ArrowRight className="h-4 w-4 text-[var(--accent)] transition-transform group-hover:translate-x-0.5" />
        </button>
      </motion.div>

    </div>
  );
};

