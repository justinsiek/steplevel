"use client";

import React from "react";
import { motion } from "framer-motion";
import { Pipeline } from "./Pipeline";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export const Hero = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[var(--background)]">
      {/* Navbar - Glassy & Modern */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex w-full items-center justify-between border-b border-black/5 bg-[var(--background)]/80 px-6 py-6 backdrop-blur-md sm:px-12">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-gradient-to-br from-[var(--foreground)] to-[var(--foreground-muted)] text-white shadow-md">
            <Image src="/steplevel.png" alt="steplevel.ai" width={40} height={40} />
          </div>

          <span className="text-lg tracking-tight">steplevel.ai</span>
        </div>
        <div className="flex items-center gap-8 text-sm font-medium text-[var(--foreground-muted)]">
          <a href="#" className="hidden sm:block">Documentation</a>
          <a href="#" className="hidden sm:block">Pricing</a>
          <a href="#" className="group relative overflow-hidden rounded-sm bg-[var(--foreground)] px-4 py-1.5 text-xs font-semibold text-white shadow-lg transition-transform hover:scale-105 active:scale-95">
            <span className="relative z-10 flex items-center gap-1">
              Request Access <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </span>
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex flex-1 flex-col items-center pt-32 pb-20 space-y-16">
        
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto max-w-5xl px-4 text-center"
        >

          <h1 className="mb-6 text-balance text-5xl font-light tracking-tight text-[var(--foreground)] sm:text-7xl md:text-8xl">
            Optimize AI agents <br className="hidden md:block" />
            <span>
              at the step level.
            </span>
          </h1>
          
          <p className="mx-auto max-w-xl text-lg text-[var(--foreground-muted)] sm:text-xl leading-relaxed">
            Granular tracing and optimization for compound AI systems. <br className="hidden sm:block"/>
            Isolate faulty steps, simulate fixes, and deploy with confidence.
          </p>
        </motion.div>

        {/* Pipeline Visualization - Prominent, no container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 1.0, type: "spring", bounce: 0.2 }}
          className="relative w-full max-w-full px-4 flex justify-center items-center"
        >
            
            <div>
              <Pipeline />
            </div>
        </motion.div>

      </main>
    </div>
  );
};
