"use client";

import { useMemo } from "react";
import { 
  BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from "recharts";
import { 
  Package, Search, Filter, AlertCircle, ArrowDown, ArrowUp, Beaker, Archive 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MOCK_RAW_MATERIALS, MOCK_SKUS } from "@/lib/mock-data";

export function InventoryModule() {
  
  // Forecast Data (Current Stock vs 30d Projected Consumption)
  const forecastData = useMemo(() => {
    return MOCK_RAW_MATERIALS.slice(0, 5).map(rm => {
      // Mock projected consumption based on stock and days until stockout
      const dailyConsumption = rm.stockKg / Math.max(1, rm.daysUntilStockout);
      const proj30d = dailyConsumption * 30;
      
      return {
        name: rm.materialName.split(' ')[0],
        grade: rm.grade,
        "Current Stock": rm.stockKg,
        "Projected Need (30d)": Math.round(proj30d)
      };
    });
  }, []);

  // Finished Goods Data
  const finishedGoods = useMemo(() => {
    return MOCK_SKUS.map(sku => {
      // Mock reserved and free stock
      const reserved = Math.floor(sku.stockAvailable * (Math.random() * 0.6 + 0.1));
      const free = sku.stockAvailable - reserved;
      const allocatedOrders = Math.floor(reserved / 1500) + 1;
      const avgAge = Math.floor(Math.random() * 45) + 5;
      
      return {
        ...sku,
        reserved,
        free,
        allocatedOrders,
        avgAge
      };
    }).sort((a,b) => b.stockAvailable - a.stockAvailable).slice(0, 10);
  }, []);


  return (
    <div className="flex flex-col gap-6 h-full pb-8">
      
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Section 1: Raw Material Stock Table */}
        <Card className="lg:w-2/3 bg-card/50 border-border/50 shadow-lg backdrop-blur-sm flex flex-col h-[400px]">
          <CardHeader className="pb-3 border-b border-border/30 bg-black/10 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-mono uppercase tracking-wider flex items-center gap-2">
                <Beaker className="h-4 w-4 text-primary" /> Raw Material Stock
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input placeholder="Search RM..." className="h-8 pl-8 w-40 bg-black/20 border-border/50 text-xs" />
              </div>
              <Button variant="outline" size="icon" className="h-8 w-8 bg-black/20"><Filter className="h-3.5 w-3.5"/></Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-auto custom-scrollbar">
            <Table>
              <TableHeader className="bg-black/20 sticky top-0 z-10 backdrop-blur-md">
                <TableRow className="border-border/20 hover:bg-transparent">
                  <TableHead className="text-[10px] uppercase tracking-wider">Material</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider">Grade</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-right">Stock (kg)</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-right">Status</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-right">Days Left</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider">Supplier</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_RAW_MATERIALS.map((rm) => (
                  <TableRow key={rm.id} className="border-border/10 hover:bg-white/5 cursor-pointer">
                    <TableCell className="font-medium text-xs text-white max-w-[150px] truncate">{rm.materialName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        "uppercase text-[9px] tracking-wider",
                        rm.grade === 'Premium' ? "border-primary/30 text-primary" : "border-white/10 text-muted-foreground"
                      )}>{rm.grade}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-mono text-sm">{rm.stockKg.toLocaleString()}</span>
                        <span className="text-[9px] text-muted-foreground font-mono">Reorder: {rm.reorderPoint}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className={cn(
                        "uppercase text-[9px] tracking-wider border-0",
                        rm.status === 'Critical' ? "bg-red-500/20 text-red-500" :
                        rm.status === 'Low' ? "bg-amber-500/20 text-amber-500" : "bg-green-500/10 text-green-400"
                      )}>
                        {rm.status === 'Critical' && <AlertCircle className="h-3 w-3 mr-1 inline" />}
                        {rm.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs">{rm.daysUntilStockout}</TableCell>
                    <TableCell className="text-xs text-muted-foreground truncate max-w-[120px]">{rm.supplier}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Section 2: Consumption Forecast Grouped Bar */}
        <Card className="lg:w-1/3 bg-[#1C2333]/80 border-border/50 shadow-lg backdrop-blur-sm flex flex-col h-[400px]">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">30-Day RM Consumption</CardTitle>
            <CardDescription className="text-[10px]">Based on active pipeline & sales forecast</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 pt-4 px-2">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={forecastData} margin={{ left: -15, right: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#6B7A99" }} axisLine={{ stroke: '#ffffff20' }} tickLine={false} interval={0} angle={-30} textAnchor="end" />
                <YAxis tick={{ fontSize: 9, fill: "#6B7A99", fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ backgroundColor: '#161B25', borderColor: '#2A3447', borderRadius: '8px', fontSize: '12px', fontFamily: 'monospace' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Bar dataKey="Current Stock" fill="#00D4AA" radius={[2, 2, 0, 0]} maxBarSize={30} />
                <Bar dataKey="Projected Need (30d)" fill="#F4A623" radius={[2, 2, 0, 0]} maxBarSize={30} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>

      {/* Section 3: Finished Goods Inventory */}
      <Card className="bg-[#161B25]/80 border-border/50 shadow-lg backdrop-blur-sm flex flex-col flex-1 min-h-[350px]">
        <CardHeader className="pb-3 border-b border-border/30 bg-black/10">
          <CardTitle className="text-sm font-mono uppercase tracking-wider flex items-center gap-2">
            <Archive className="h-4 w-4 text-primary" /> Finished Goods Inventory
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-auto custom-scrollbar">
          <Table>
            <TableHeader className="bg-black/20 sticky top-0 z-10 backdrop-blur-md">
              <TableRow className="border-border/20 hover:bg-transparent">
                <TableHead className="text-xs uppercase tracking-wider pl-4">SKU</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-right">Total Available</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-right">Reserved (Active POs)</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-right text-primary">Free Stock</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-center">Avg Age (Days)</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-center">Allocated To</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {finishedGoods.map((sku) => (
                <TableRow key={sku.id} className="border-border/10 hover:bg-white/5 cursor-pointer group">
                  <TableCell className="pl-4">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full border border-white/20 shadow-sm shrink-0" style={{ backgroundColor: sku.rgb }}></div>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm text-white">{sku.name}</span>
                        <span className="text-xs text-muted-foreground font-mono">{sku.skuCode}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">{sku.stockAvailable.toLocaleString()} kg</TableCell>
                  <TableCell className="text-right font-mono text-sm text-amber-500 opacity-80">{sku.reserved.toLocaleString()} kg</TableCell>
                  <TableCell className="text-right font-mono text-sm font-bold text-primary">{sku.free.toLocaleString()} kg</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={cn(
                      "font-mono text-xs border-0",
                      sku.avgAge > 30 ? "bg-amber-500/10 text-amber-400" : "bg-white/5 text-muted-foreground"
                    )}>
                      {sku.avgAge}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-xs text-muted-foreground font-mono">{sku.allocatedOrders} Orders</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
}
