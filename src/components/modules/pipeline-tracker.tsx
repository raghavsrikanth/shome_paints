"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { 
  Activity, AlertTriangle, ArrowRight, Play, Pause, TrendingDown, Factory
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { MOCK_BATCHES } from "@/lib/mock-data";
import { PipelineStage } from "@/lib/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from "recharts";

const STAGES: PipelineStage[] = [
  "Precipitation", "Filter Press", "Washing", "Drying", "Finishing", "Dispatch"
];

export function PipelineTrackerModule() {
  
  // Get active batch for each stage (picking the lowest completion % or highest priority)
  const activeBatchPerStage = useMemo(() => {
    return STAGES.map(stage => {
      const batchesInStage = MOCK_BATCHES.filter(b => b.stage === stage);
      // Sort by priority then completion (lowest first)
      batchesInStage.sort((a, b) => {
        if (a.priority === 'High' && b.priority !== 'High') return -1;
        if (b.priority === 'High' && a.priority !== 'High') return 1;
        return a.completionPercentage - b.completionPercentage;
      });
      return { stage, batch: batchesInStage[0] || null };
    });
  }, []);

  // Bottleneck detection (mock logic: lowest throughput rate with highest yield loss)
  const bottleneck = useMemo(() => {
    const active = activeBatchPerStage.filter(s => s.batch).map(s => s.batch!);
    if (active.length === 0) return null;
    return active.reduce((worst, current) => {
      // higher score = worse bottleneck
      const currentScore = (1000 / current.throughputRate) * (current.yieldLossPercentage || 1);
      const worstScore = (1000 / worst.throughputRate) * (worst.yieldLossPercentage || 1);
      return currentScore > worstScore ? current : worst;
    }, active[0]);
  }, [activeBatchPerStage]);

  // Waterfall Chart Data
  // Format for Recharts Waterfall: [start, end] values per bar
  const waterfallData = useMemo(() => {
    let currentInput = 10000; // Base start kg
    return STAGES.slice(0, 5).map(stage => {
      const stageBatch = activeBatchPerStage.find(s => s.stage === stage)?.batch;
      const lossPct = stageBatch ? stageBatch.yieldLossPercentage : 1.5;
      const lossAmt = currentInput * (lossPct / 100);
      const endOutput = currentInput - lossAmt;
      const data = {
        name: stage,
        loss: lossAmt,
        output: [endOutput, currentInput], // Range for the bar
        pct: lossPct
      };
      currentInput = endOutput;
      return data;
    });
  }, [activeBatchPerStage]);

  return (
    <div className="flex flex-col gap-6 h-full pb-4">
      {/* Top: Horizontal Pipeline Flow */}
      <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-lg backdrop-blur-sm overflow-x-auto custom-scrollbar">
        <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4 pl-2 flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" /> Active Pipeline Sequence
        </h3>
        
        <div className="flex items-center min-w-max pb-2">
          {activeBatchPerStage.map((s, idx) => (
            <div key={s.stage} className="flex items-center">
              {/* Stage Card */}
              <div className={cn(
                "relative w-64 rounded-xl border p-4 bg-black/20 flex flex-col gap-3 group transition-all",
                s.batch?.machineStatus === 'Warning' ? "border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]" : "border-border/50 hover:border-primary/50"
              )}>
                {/* Stage Header */}
                <div className="flex justify-between items-center">
                  <span className="font-mono text-sm font-bold truncate">{s.stage}</span>
                  {s.batch ? (
                    <Badge variant="outline" className={cn(
                      "text-[10px] uppercase font-mono px-1.5 py-0 border-0 flex items-center gap-1",
                      s.batch.machineStatus === 'Running' ? "text-green-400 bg-green-500/10" :
                      s.batch.machineStatus === 'Warning' ? "text-amber-400 bg-amber-500/10" : "text-muted-foreground bg-white/5"
                    )}>
                      {s.batch.machineStatus === 'Running' ? <Play className="h-2 w-2 fill-current" /> : 
                       s.batch.machineStatus === 'Warning' ? <AlertTriangle className="h-2 w-2" /> : <Pause className="h-2 w-2" />}
                      {s.batch.machineStatus}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground font-mono">IDLE</span>
                  )}
                </div>

                {s.batch ? (
                  <>
                    <div className="text-sm truncate text-muted-foreground">
                      <span className="text-white font-medium">{s.batch.id}</span> • {s.batch.skuId}
                    </div>
                    
                    <div className="space-y-1.5 mt-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-primary">{s.batch.completionPercentage}%</span>
                        <span className="text-muted-foreground">{s.batch.throughputRate} kg/hr</span>
                      </div>
                      {/* Animated Progress */}
                      <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden relative">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-1000 ease-in-out relative",
                            s.batch.machineStatus === 'Warning' ? "bg-amber-500" : "bg-primary"
                          )}
                          style={{ width: `${s.batch.completionPercentage}%` }}
                        >
                          {s.batch.machineStatus === 'Running' && (
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div className="bg-black/30 rounded p-1.5 flex flex-col items-center justify-center border border-white/5">
                        <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Est. Finish</span>
                        <span className="text-xs font-mono mt-0.5">{format(new Date(s.batch.estimatedCompletion), 'HH:mm')}</span>
                      </div>
                      <div className="bg-black/30 rounded p-1.5 flex flex-col items-center justify-center border border-white/5">
                        <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Yield Loss</span>
                        <span className={cn(
                          "text-xs font-mono mt-0.5",
                          s.batch.yieldLossPercentage > 2 ? "text-amber-400" : "text-white"
                        )}>{s.batch.yieldLossPercentage}%</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-[120px] flex items-center justify-center border border-dashed border-white/10 rounded-lg bg-black/10">
                    <span className="text-xs text-muted-foreground">Awaiting Input</span>
                  </div>
                )}
              </div>

              {/* Arrow separator except last */}
              {idx < STAGES.length - 1 && (
                <div className="px-3 flex flex-col items-center text-muted-foreground/30">
                  <ArrowRight className="h-6 w-6" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left: Active Batches Table */}
        <Card className="lg:col-span-8 bg-[#161B25]/80 border-border/50 shadow-lg flex flex-col backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
          
          <CardHeader className="pb-3 border-b border-border/30 bg-black/10">
            <CardTitle className="text-base font-mono flex items-center justify-between">
              <span className="flex items-center gap-2"><Factory className="h-4 w-4 text-primary" /> ACTIVE BATCHES</span>
              <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 font-mono text-xs">
                {MOCK_BATCHES.length} Total
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-auto custom-scrollbar">
            <Table>
              <TableHeader className="bg-black/20 sticky top-0 z-10 backdrop-blur-md">
                <TableRow className="border-border/20 hover:bg-transparent">
                  <TableHead className="w-[100px] text-xs uppercase tracking-wider">Batch ID</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider">SKU</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider">Stage</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-right">ETA</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-center">Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_BATCHES.map((batch) => (
                  <TableRow key={batch.id} className="border-border/10 hover:bg-white/5 cursor-pointer">
                    <TableCell className="font-mono text-sm text-white font-medium">{batch.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm max-w-[180px] lg:max-w-[220px] truncate">{batch.skuName}</span>
                        <span className="text-xs text-muted-foreground font-mono">{batch.skuId}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-black/40 rounded-full overflow-hidden">
                          <div className={cn(
                            "h-full rounded-full",
                            batch.machineStatus === 'Warning' ? "bg-amber-500" : "bg-primary"
                          )} style={{ width: `${batch.completionPercentage}%` }}></div>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{batch.stage}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs whitespace-nowrap">
                      {format(new Date(batch.estimatedCompletion), 'MMM d, HH:mm')}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={cn(
                        "uppercase text-[10px] tracking-wider font-mono",
                        batch.priority === 'High' ? "border-red-500/30 text-red-400 bg-red-500/5" :
                        batch.priority === 'Normal' ? "border-white/10 text-muted-foreground" : "border-white/5 text-muted-foreground/50 opacity-50"
                      )}>
                        {batch.priority}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Right: Bottleneck & Yield Loss */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Bottleneck Alert */}
          <Card className={cn(
            "border-border/50 shadow-lg relative overflow-hidden",
            bottleneck ? "bg-amber-500/5" : "bg-card/50"
          )}>
            {bottleneck && <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>}
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <AlertTriangle className={cn("h-4 w-4", bottleneck ? "text-amber-500" : "text-muted-foreground")} /> 
                System Bottleneck
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bottleneck ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xl font-bold text-amber-500">{bottleneck.stage}</h4>
                      <p className="text-sm text-muted-foreground font-mono mt-1">Batch {bottleneck.id}</p>
                    </div>
                    <Badge className="bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 font-mono text-xs border-0">
                      Rate Limiting
                    </Badge>
                  </div>
                  <div className="bg-black/30 rounded-lg p-3 border border-amber-500/20 text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Throughput:</span>
                      <span className="font-mono text-white">{bottleneck.throughputRate} kg/hr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Current Yield Loss:</span>
                      <span className="font-mono text-amber-400">{bottleneck.yieldLossPercentage}%</span>
                    </div>
                    <div className="pt-2 border-t border-white/5 text-xs text-muted-foreground">
                      Recommendation: Increase wash cycle speed or bypass secondary filtration for non-critical queue.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-green-400 flex items-center gap-2">
                  <Activity className="h-4 w-4" /> All stages running at nominal capacity.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cumulative Yield Loss Waterfall */}
          <Card className="bg-[#1C2333]/80 border-border/50 shadow-lg flex-1 flex flex-col text-xs">
            <CardHeader className="pb-0 pt-4">
              <CardTitle className="text-sm font-mono uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-2"><TrendingDown className="h-4 w-4 text-primary" /> Yield Waterfall</span>
                <span className="text-muted-foreground text-[10px]">Current Shift</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-[220px] pt-4 pr-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={waterfallData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#6B7A99" }} axisLine={{ stroke: '#ffffff20' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "#6B7A99", fontFamily: 'monospace' }} domain={['dataMin - 500', 'dataMax + 100']} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    cursor={{ fill: '#ffffff05' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-[#161B25] border border-border/50 p-2 rounded shadow-xl font-mono text-xs">
                            <p className="font-bold text-white mb-1">{data.name}</p>
                            <p className="text-muted-foreground">Start: {(data.output[1] as number).toFixed(0)}kg</p>
                            <p className="text-red-400">Loss: {(data.loss as number).toFixed(0)}kg ({data.pct}%)</p>
                            <p className="text-primary mt-1 border-t border-white/10 pt-1">Survives: {(data.output[0] as number).toFixed(0)}kg</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  {/* Recharts Bar supports array data [min, max] for floating bars */}
                  <Bar dataKey="output" radius={[2, 2, 0, 0]} maxBarSize={40}>
                    {waterfallData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? "#00D4AA" : index === waterfallData.length -1 ? "#00D4AA" : "#005e4c"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
