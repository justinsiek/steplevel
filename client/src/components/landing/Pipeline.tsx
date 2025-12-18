"use client";

import React, { useState } from "react";
import { StepBlock, StepData } from "./StepBlock";
import { clsx } from "clsx";

// A realistic, moderate-length agent execution trace
const GENERATED_STEPS: StepData[] = [
    {
        id: "step-1",
        label: "User Input",
        type: "retrieve",
        metrics: { latency: 45, cost: 0.00, errorRate: 0 },
        status: "normal"
    },
    {
        id: "step-2",
        label: "RAG Lookup",
        type: "retrieve",
        metrics: { latency: 245, cost: 0.002, errorRate: 1.2 },
        status: "normal"
    },
    {
        id: "step-3",
        label: "Reasoning",
        type: "reason",
        metrics: { latency: 1250, cost: 0.015, errorRate: 0.5 },
        status: "normal"
    },
    {
        id: "step-4",
        label: "Plan Tools",
        type: "reason",
        metrics: { latency: 680, cost: 0.008, errorRate: 12.4 },
        status: "warning" // The detailed hover target (Reasoning step, not Tool)
    },
    {
        id: "step-5",
        label: "Stripe API",
        type: "tool",
        metrics: { latency: 980, cost: 0.021, errorRate: 0.1 },
        status: "normal"
    },
    {
        id: "step-6",
        label: "Validate",
        type: "validate",
        metrics: { latency: 120, cost: 0.001, errorRate: 0.0 },
        status: "normal"
    },
    {
        id: "step-7",
        label: "Format",
        type: "reason",
        metrics: { latency: 85, cost: 0.002, errorRate: 0 },
        status: "normal"
    },
    {
        id: "step-8",
        label: "Response",
        type: "respond",
        metrics: { latency: 320, cost: 0.005, errorRate: 0 },
        status: "normal"
    }
];

export const Pipeline = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
  return (
    <div className="relative w-full overflow-hidden py-32 flex justify-center items-center">
      
      {/* Connector Line (Behind) */}
      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-slate-200 -z-10 max-w-5xl mx-auto" />

      {/* Steps Container */}
      <div className="flex items-center gap-3 px-4 h-80">
        {GENERATED_STEPS.map((step, index) => {
          // If we hover something, dim the others slightly
          // Removing dimming as per request
          
          return (
            <div 
                key={step.id}
                className="transition-all duration-500 ease-out"
            >
              <StepBlock 
                data={step} 
                isHovered={hoveredId === step.id} 
                isSiblingHovered={hoveredId !== null && hoveredId !== step.id}
                onHover={setHoveredId}
                index={index}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
