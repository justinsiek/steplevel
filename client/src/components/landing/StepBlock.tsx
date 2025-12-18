"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle, Activity, Search, Brain, Terminal, ShieldCheck, MessageSquare } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const WIDTH_IDLE = 150;
const WIDTH_HOVERED = 325;
const WIDTH_COMPRESSED = 125;

const Typewriter = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayed, setDisplayed] = useState("");
  
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const timer = setTimeout(() => {
        const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(interval);
        }, 30);
        return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [text, delay]);

  return <span>{displayed}</span>;
};

export type StepData = {
  id: string;
  label: string;
  type: "retrieve" | "reason" | "tool" | "validate" | "respond" | "trace";
  metrics: {
    latency: number;
    cost: number;
    errorRate: number;
  };
  status: "normal" | "warning" | "idle";
};

interface StepBlockProps {
  data: StepData;
  isHovered: boolean;
  isSiblingHovered: boolean; // New prop
  onHover: (id: string | null) => void;
  index: number;
}

type OptimizationStage = 
  | "idle"
  | "analyzing"
  | "issue-found"
  | "optimizing"
  | "complete";

const getIconForType = (type: StepData['type']) => {
    switch (type) {
        case 'retrieve': return Search;
        case 'reason': return Brain;
        case 'tool': return Terminal;
        case 'validate': return ShieldCheck;
        case 'respond': return MessageSquare;
        default: return Activity;
    }
};

export const StepBlock = ({ data, isHovered, isSiblingHovered, onHover, index }: StepBlockProps) => {
  const [stage, setStage] = useState<OptimizationStage>("idle");
  const [shadowMetrics, setShadowMetrics] = useState({ ...data.metrics });
  const [currentMetrics, setCurrentMetrics] = useState({ ...data.metrics });
  
  const Icon = getIconForType(data.type);

  // Only run simulation for "warning" steps
  const canOptimize = data.status === "warning";

  useEffect(() => {
    // Reset simulation when hover ends, unless completed
    if (!isHovered && stage !== "complete") {
      setStage("idle");
      setCurrentMetrics(data.metrics);
    }
  }, [isHovered, data.metrics, stage]);

  useEffect(() => {
    // Explicitly check for idle state to prevent restart loops
    if (isHovered && stage === "idle" && canOptimize) {
      let timeout: NodeJS.Timeout;
      const runSimulation = async () => {
        // Start simulation
        setStage("analyzing");
        await new Promise((r) => { timeout = setTimeout(r, 600); });
        
        setStage("issue-found");
        await new Promise((r) => { timeout = setTimeout(r, 1800); }); 
        
        setStage("optimizing");
        await new Promise((r) => { timeout = setTimeout(r, 1200); });
        
        // Apply optimization results
        const targetLatency = Math.floor(data.metrics.latency * 0.37);
        const targetCost = data.metrics.cost * 0.39;
        const targetError = 0; 

        setCurrentMetrics({
            latency: targetLatency,
            cost: targetCost,
            errorRate: targetError
        });
        setStage("complete");
      };
      runSimulation();
      return () => clearTimeout(timeout);
    }
  }, [isHovered, canOptimize]); // Removed 'stage' from dependency array to prevent loop issues

  const isWarning = data.status === "warning" && stage === "idle";
  const isComplete = stage === "complete";

  let width = WIDTH_IDLE;
  if (isHovered) width = WIDTH_HOVERED;
  else if (isSiblingHovered) width = WIDTH_COMPRESSED;

  return (
    <motion.div
      layout
      onMouseEnter={() => onHover(data.id)}
      onMouseLeave={() => onHover(null)} 
      className={cn(
        "relative flex flex-col overflow-hidden bg-white transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]",
        "border",
        isHovered ? "z-20 shadow-xl border-slate-200" : "z-0 shadow-sm border-slate-200 hover:border-slate-300",
        // Warning state styling
        !isHovered && isWarning ? "border-red-200 bg-red-50/30" : "",
        isComplete ? "border-emerald-200 bg-emerald-50/10" : ""
      )}
      style={{
        width,
        height: 220, 
        minHeight: 220,
        maxHeight: 220,
      }}
    >
        {/* IDLE STATE CONTENT (Visible when NOT hovered) */}
        <div className={cn(
            "absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 transition-opacity duration-300",
            isHovered ? "opacity-0 pointer-events-none delay-0" : "opacity-100 delay-100"
        )}>
            <div className={cn(
                "p-2.5 transition-colors duration-500",
                isWarning ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-600",
                isComplete && "bg-emerald-100 text-emerald-600"
            )}>
                {isComplete ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
            </div>
            <div className="text-center w-full">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    {data.type}
                </div>
                {isComplete && (
                     <div className="flex items-center justify-center gap-1.5 text-[10px] font-medium text-emerald-600">
                        <span>Fixed</span>
                     </div>
                )}
            </div>
            
            <div className="mt-auto mb-1 w-full px-2 space-y-1.5">
                <div className={cn(
                    "flex text-[10px] font-mono text-slate-500",
                    isSiblingHovered ? "justify-center" : "justify-between"
                )}>
                    {!isSiblingHovered && <span>lat</span>}
                    <span>{currentMetrics.latency}ms</span>
                </div>
                <div className={cn(
                    "flex text-[10px] font-mono text-slate-500",
                    isSiblingHovered ? "justify-center" : "justify-between"
                )}>
                    {!isSiblingHovered && <span>cost</span>}
                    <span>${data.metrics.cost.toFixed(3)}</span>
                </div>
                <div className={cn(
                    "flex text-[10px] font-mono",
                    isSiblingHovered ? "justify-center" : "justify-between",
                    isWarning && !isComplete ? "text-red-600 font-bold" : "text-slate-500",
                    isComplete && "text-emerald-600 font-bold"
                )}>
                    {!isSiblingHovered && <span>err</span>}
                    <span>{isComplete ? "0%" : `${data.metrics.errorRate}%`}</span>
                </div>
            </div>
            
        </div>


      {/* EXPANDED CONTENT (Visible ONLY when hovered) */}
      <div className={cn(
        "flex h-full w-full flex-col justify-between p-6 opacity-0 transition-opacity duration-300",
        isHovered ? "opacity-100 delay-100" : "opacity-0 pointer-events-none delay-0"
      )}>
        
        {/* Top: Header Info (Larger) */}
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className={cn(
                 "p-2 transition-colors duration-500",
                 isWarning ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-600",
                 isComplete && "bg-emerald-100 text-emerald-600"
             )}>
                 {isComplete ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
             </div>
             <h3 className="text-lg font-medium text-slate-900 leading-tight">
                {data.label}
             </h3>
           </div>
           <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
             STEP {index + 1}
           </span>
        </div>
        
        {/* Bottom: Dynamic Content Area (Optimization Flow) */}
        <div className="flex flex-col justify-end gap-3">
            {canOptimize ? (
                <>
                    {/* Status Line */}
                    <div className="min-h-[20px] flex items-center">
                        {stage === "idle" && <span className="text-xs text-slate-400">Ready for analysis</span>}
                        
                        {stage === "analyzing" && (
                             <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Activity className="h-4 w-4 animate-pulse" />
                                <span>Scanning execution trace...</span>
                            </div>
                        )}
                        
                        {stage === "issue-found" && (
                             <div className="bg-red-50 p-2.5 border border-red-100 w-full">
                                <div className="flex items-center gap-2 text-xs text-red-700 font-semibold mb-1">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>Reasoning Loop Detected</span>
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-red-600/90">
                                    <div className="col-span-2">High error rate in planning step.</div>
                                    <div>Error: {data.metrics.errorRate}%</div>
                                    <div>Cost: ${data.metrics.cost.toFixed(3)}</div>
                                </div>
                            </div>
                        )}

                        {stage === "optimizing" && (
                             <div className="flex items-center gap-2 text-xs text-indigo-600 font-medium animate-pulse">
                                <Activity className="h-4 w-4" />
                                <span>Refining system prompt...</span>
                            </div>
                        )}

                        {stage === "complete" && (
                            <div className="bg-emerald-50 p-2.5 border border-emerald-100 w-full">
                                <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold mb-1">
                                    <Check className="h-4 w-4" />
                                    <span>Issue Resolved</span>
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-emerald-600/90">
                                    <div>Lat: {currentMetrics.latency}ms</div>
                                    <div>Error: {currentMetrics.errorRate}%</div>
                                    <div>Cost: ${currentMetrics.cost.toFixed(3)}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                // Normal Step Content - Larger Text
                <div className="space-y-2.5">
                     <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Status</span>
                        <span className="text-emerald-600 font-medium">Healthy</span>
                     </div>
                     <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Latency</span>
                        <span className="text-slate-700 font-mono">{data.metrics.latency}ms</span>
                     </div>
                     <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Cost</span>
                        <span className="text-slate-700 font-mono">${data.metrics.cost.toFixed(4)}</span>
                     </div>
                     <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Failure Rate</span>
                        <span className="text-slate-700 font-mono">{data.metrics.errorRate}%</span>
                     </div>
                </div>
            )}
        </div>
      </div>
    </motion.div>
  );
};
