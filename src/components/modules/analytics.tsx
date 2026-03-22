"use client";

import { useState } from "react";
import { 
  BarChart as RechartsBarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis
} from "recharts";
import { format, subDays } from "date-fns";
import { 
  Calendar as CalendarIcon, Download, Factory, AlertTriangle, TrendingUp, TrendingDown, Clock, ShieldAlert 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { MOCK_THROUGHPUT_DATA, MOCK_YIELD_LOSS_TREND } from "@/lib/mock-data";

// Mock Data
const REVENUE_SPLIT = [
  { name: 'Paints', value: 45 },
  { name: 'Inks', value: 25 },
  { name: 'Print', value: 15 },
  { name: 'Textile', value: 10 },
  { name: 'Seed Colorizing', value: 5 },
];
const COLORS = ['#00D4AA', '#F4A623', '#2B82CB', '#8E44AD', '#E74C3C'];
const STAGE_COLORS = { Precipitation: '#00D4AA', FilterPress: '#F4A623', Washing: '#2B82CB', Drying: '#8E44AD', Finishing: '#E74C3C' };

const REJECTION_DATA = [
  { sku: 'PY13-STD', rate: 4.2 },
  { sku: 'PB15-STD', rate: 3.8 },
  { sku: 'PR57-STD', rate: 3.1 },
  { sku: 'PY83-ULT', rate: 2.5 },
  { sku: 'PW6-RUT', rate: 1.2 }
];

// Heatmap Data (Days x Weeks) 7x4
const HEATMAP_DATA = Array.from({ length: 28 }).map((_, i) => ({
  day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i % 7],
  week: `W${Math.floor(i / 7) + 1}`,
  utilization: Math.floor(Math.random() * 40) + 60 // 60-100%
}));

export function AnalyticsModule() {
  const [dateRange, setDateRange] = useState("30d");
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="flex flex-col gap-6 h-full pb-8">
      
      {/* Top Bar: Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card/40 border border-border/50 p-4 rounded-xl backdrop-blur-sm">
        <div>
          <h2 className="font-mono text-lg font-semibold flex items-center gap-2">
            <Factory className="h-5 w-5 text-primary" /> Plant Efficiency Analytics
          </h2>
          <p className="text-sm text-muted-foreground">Aggregated data across all production lines</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
          <Select value={dateRange} onValueChange={(v) => { if (v) setDateRange(v); }}>
            <SelectTrigger className="w-[140px] bg-black/20 font-mono text-xs h-9">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>

          {dateRange === "custom" && (
            <Popover>
              <PopoverTrigger className="inline-flex items-center justify-start rounded-md border border-input bg-black/20 px-3 py-2 text-xs font-normal shadow-sm hover:bg-accent hover:text-accent-foreground h-9">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "MMM d, yyyy") : <span>Pick date</span>}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          )}

          <Button variant="outline" size="sm" className="h-9 bg-black/20 text-xs px-3 font-mono">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: "Today's Output", val: "12,450", unit: "kg", trend: "+5.2%", up: true, icon: Factory },
          { label: "OEE", val: "84.2", unit: "%", trend: "+1.1%", up: true, icon: TrendingUp },
          { label: "On-Time Deliv", val: "96.5", unit: "%", trend: "-0.5%", up: false, icon: Clock },
          { label: "Avg Yield Loss", val: "3.2", unit: "%", trend: "-0.8%", up: true, icon: AlertTriangle }, // decrease in loss is good
          { label: "RM Cost Var", val: "+2.4", unit: "%", trend: "Over budget", up: false, icon: ShieldAlert },
        ].map((kpi, i) => (
          <Card key={i} className="bg-black/20 border-border/50 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-[100px] pointer-events-none transition-all group-hover:bg-primary/10"></div>
            <CardContent className="p-4 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <span className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">{kpi.label}</span>
                <kpi.icon className="h-4 w-4 text-muted-foreground opacity-50" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-mono text-white tracking-tighter">{kpi.val}</span>
                <span className="text-xs text-muted-foreground font-mono">{kpi.unit}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-auto text-[10px]">
                <span className={cn("px-1.5 py-0.5 rounded flex items-center gap-1 font-mono", kpi.up ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400")}>
                  {kpi.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {kpi.trend}
                </span>
                <span className="text-muted-foreground">vs prev pd</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Production Volume Stacked Bar */}
        <Card className="lg:col-span-2 bg-card border-border/50 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Daily Production Volume by Family</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] pt-4 pr-6">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={MOCK_THROUGHPUT_DATA.slice(-14)} margin={{ left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#6B7A99" }} axisLine={{ stroke: '#ffffff20' }} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#6B7A99", fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ backgroundColor: '#161B25', borderColor: '#2A3447', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="Azo Yellow" stackId="a" fill="#F4A623" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Azo Red" stackId="a" fill="#E74C3C" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Phthalocyanine" stackId="a" fill="#2B82CB" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Others" stackId="a" fill="#8E44AD" radius={[2, 2, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Industry Revenue Donut */}
        <Card className="bg-card border-border/50 shadow-lg">
          <CardHeader className="pb-0">
            <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Rev Split by Industry</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex flex-col items-center justify-center -mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={REVENUE_SPLIT} cx="50%" cy="50%" innerRadius={60} outerRadius={80}
                  paddingAngle={5} dataKey="value" stroke="none"
                >
                  {REVENUE_SPLIT.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#161B25', borderColor: '#2A3447', borderRadius: '8px', fontSize: '12px' }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={((val: number) => [`${val}%`, 'Revenue']) as any}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full grid grid-cols-2 gap-x-2 gap-y-3 mt-auto mb-2 px-4">
              {REVENUE_SPLIT.slice(0, 4).map((ind, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                  <span className="text-muted-foreground truncate">{ind.name}</span>
                  <span className="font-mono ml-auto">{ind.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Yield Loss Trend Line Chart */}
        <Card className="xl:col-span-2 bg-card border-border/50 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground flex justify-between">
              Yield Loss Trend by Stage
              <Badge variant="outline" className="text-[10px] font-mono border-red-500/30 text-red-400 bg-red-500/10">-0.8% YoY</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] pt-4 pr-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_YIELD_LOSS_TREND} margin={{ left: -20, top: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#6B7A99" }} axisLine={{ stroke: '#ffffff20' }} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#6B7A99", fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#161B25', borderColor: '#2A3447', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                <Line type="monotone" dataKey="Washing" stroke={STAGE_COLORS.Washing} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="FilterPress" stroke={STAGE_COLORS.FilterPress} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Precipitation" stroke={STAGE_COLORS.Precipitation} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quality Rejection Rate */}
        <Card className="bg-card border-border/50 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Quality Rejection Rate</CardTitle>
            <CardDescription className="text-[10px]">Top 5 Problematic SKUs (%)</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] pt-0">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={REJECTION_DATA} layout="vertical" margin={{ left: 20, right: 20, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="sku" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#E8EDF5", fontFamily: 'monospace' }} />
                <RechartsTooltip 
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ backgroundColor: '#161B25', borderColor: '#2A3447', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="rate" fill="#FF4757" radius={[0, 4, 4, 0]} barSize={16}>
                  {REJECTION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#FF4757' : index === 1 ? '#ff6b79' : '#ff8a96'} />
                  ))}
                </Bar>
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
