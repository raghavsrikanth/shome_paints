"use client";

import { useState, useMemo, useEffect } from "react";
import { format, addDays } from "date-fns";
import { Calendar as CalendarIcon, CheckCircle2, AlertCircle, Clock, FileText, ChevronDown, PackageCheck, FlaskConical, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MOCK_SKUS } from "@/lib/mock-data";
import { IndustryApplication, PigmentFamily, QualityTier } from "@/lib/types";

const INDUSTRIES: IndustryApplication[] = ["Paints", "Inks", "Print", "Textile", "Seed Colorizing"];
const FAMILIES: PigmentFamily[] = ["Azo Yellow", "Azo Red", "Phthalocyanine Blue", "Phthalocyanine Green", "Dioxazine Violet", "Carbon Black", "Titanium White", "Iron Oxide", "Others"];
const TIERS: QualityTier[] = ["Standard", "Premium", "Ultra-Premium"];

// Industry specific base requirements (mock logic)
const getIndustrySpecs = (industry: IndustryApplication, sku: any) => {
  const specs = [
    { parameter: "Transparency", minRequired: industry === 'Inks' ? 75 : 0, maxAllowed: industry === 'Paints' ? 50 : 100 },
    { parameter: "Lightfastness", minRequired: industry === 'Textile' || industry === 'Paints' ? 6 : 4, maxAllowed: 8 },
    { parameter: "Heat Resistance", minRequired: industry === 'Paints' ? 180 : 120, maxAllowed: null },
    { parameter: "Moisture Content", minRequired: 0, maxAllowed: industry === 'Print' ? 1.0 : 2.0 },
    { parameter: "Oil Absorption", minRequired: null, maxAllowed: industry === 'Print' ? 45 : 100 },
  ];
  
  return specs.map(s => {
    let current = 0;
    if (s.parameter === "Transparency") current = sku.transparency;
    if (s.parameter === "Lightfastness") current = sku.lightfastness;
    if (s.parameter === "Heat Resistance") current = sku.heatResistance;
    if (s.parameter === "Moisture Content") current = sku.moistureContent;
    if (s.parameter === "Oil Absorption") current = sku.oilAbsorption;

    let status: "Pass" | "Fail" | "Borderline" = "Pass";
    
    if (s.minRequired !== null && current < s.minRequired) status = "Fail";
    if (s.maxAllowed !== null && current > s.maxAllowed) status = "Fail";
    
    if (status !== "Fail" && s.minRequired !== null && current < s.minRequired + (s.maxAllowed ? (s.maxAllowed - s.minRequired)*0.1 : 5)) status = "Borderline";
    if (status !== "Fail" && s.maxAllowed !== null && current > s.maxAllowed - (s.minRequired ? (s.maxAllowed - s.minRequired)*0.1 : 5)) status = "Borderline";

    return { ...s, currentCapability: current, status, notes: status === 'Fail' ? 'Does not meet industry spec' : 'Within spec' };
  });
};

export function OrderSimulationModule() {
  const [customer, setCustomer] = useState("");
  const [industry, setIndustry] = useState<IndustryApplication>("Paints");
  const [family, setFamily] = useState<PigmentFamily>("Azo Yellow");
  const [quality, setQuality] = useState<QualityTier>("Premium");
  const [skuId, setSkuId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(5000);
  const [deliveryDate, setDeliveryDate] = useState<Date>(addDays(new Date(), 14));
  const [margin, setMargin] = useState<number>(35); // 15 to 60

  // Filter SKUs
  const availableSkus = useMemo(() => {
    return MOCK_SKUS.filter(s => s.family === family && s.qualityTier === quality);
  }, [family, quality]);

  // Auto-select SKU if available list changes
  useEffect(() => {
    if (availableSkus.length > 0 && !availableSkus.find(s => s.id === skuId)) {
      setSkuId(availableSkus[0].id);
    } else if (availableSkus.length === 0) {
      setSkuId("");
    }
  }, [availableSkus, skuId]);

  const selectedSku = useMemo(() => availableSkus.find(s => s.id === skuId), [availableSkus, skuId]);

  // Calculations
  const rawMaterialCost = selectedSku ? selectedSku.baseCost * quantity : 0;
  // Mock production time: 10 hours setup + 1 hr per 500kg
  const productionTime = selectedSku ? 10 + (quantity / 500) : 0; 
  const suggestedPrice = selectedSku ? selectedSku.baseCost / (1 - (margin / 100)) : 0;
  const totalValue = suggestedPrice * quantity;
  
  // Feasibility logic
  const daysUntilDelivery = (deliveryDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24);
  const feasibility = daysUntilDelivery < (productionTime / 24) + 2 ? "RED" : daysUntilDelivery < (productionTime / 24) + 7 ? "AMBER" : "GREEN";

  const specs = selectedSku ? getIndustrySpecs(industry, selectedSku) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full pb-4">
      {/* Left Panel: Configuration */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <Card className="flex-1 bg-card/50 border-border/50 backdrop-blur-sm shadow-xl flex flex-col">
          <CardHeader className="border-b border-border/50 pb-4 bg-primary/5 rounded-t-xl">
            <div className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-primary" />
              <CardTitle>Order Configuration</CardTitle>
            </div>
            <CardDescription>Simulate custom batches with live operational metrics.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            
            <div className="space-y-2">
              <Label htmlFor="customer" className="text-xs uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                Customer Name <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded text-white/50 border border-white/5">PO-REF REQUIRED</span>
              </Label>
              <Input 
                id="customer" 
                placeholder="e.g. AkzoNobel, BASF..." 
                value={customer} 
                onChange={e => setCustomer(e.target.value)}
                className="bg-black/20 border-border/50 h-10 transition-all focus:bg-black/40"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Industry</Label>
                <Select value={industry} onValueChange={(v) => setIndustry(v as IndustryApplication)}>
                  <SelectTrigger className="bg-black/20 border-border/50 h-10">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Quality Tier</Label>
                <Select value={quality} onValueChange={(v) => setQuality(v as QualityTier)}>
                  <SelectTrigger className="bg-black/20 border-border/50 h-10">
                    <SelectValue placeholder="Select tier" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIERS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Pigment Family</Label>
                <Select value={family} onValueChange={(v) => setFamily(v as PigmentFamily)}>
                  <SelectTrigger className="bg-black/20 border-border/50 h-10">
                    <SelectValue placeholder="Select family" />
                  </SelectTrigger>
                  <SelectContent>
                    {FAMILIES.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Target SKU</Label>
                <Select value={skuId} onValueChange={(v) => { if (v) setSkuId(v); }} disabled={availableSkus.length === 0}>
                  <SelectTrigger className="bg-black/20 border-border/50 h-10">
                    <SelectValue placeholder={availableSkus.length === 0 ? "No SKUs available" : "Select SKU"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSkus.map(s => (
                      <SelectItem key={s.id} value={s.id}>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: s.rgb }}></div>
                          <span className="truncate max-w-[120px]">{s.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4 pt-2 border-t border-border/30">
              <div className="flex justify-between items-center">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Quantity (kg)</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    type="number" 
                    value={quantity} 
                    onChange={e => setQuantity(Number(e.target.value))}
                    className="w-24 h-8 text-right bg-black/20 font-mono text-sm border-border/50"
                  />
                </div>
              </div>
              <Slider 
                value={[quantity]} 
                min={50} 
                max={50000} 
                step={50} 
                onValueChange={(val) => setQuantity(Array.isArray(val) ? val[0] : val as unknown as number)}
                className="py-2"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>50kg</span>
                <span>Batch Cap: 5,000kg</span>
                <span>50,000kg</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-border/30">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Required Delivery Date</Label>
              <Popover>
                <PopoverTrigger className={cn(
                  "inline-flex items-center justify-start rounded-md border border-border/50 bg-black/20 px-4 py-2 text-sm font-normal shadow-sm hover:bg-accent hover:text-accent-foreground h-10 w-full",
                  !deliveryDate && "text-muted-foreground"
                )}>
                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                  {deliveryDate ? format(deliveryDate, "PPP") : <span>Pick a date</span>}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={deliveryDate}
                    onSelect={(d) => d && setDeliveryDate(d)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
          </CardContent>
        </Card>
      </div>

      {/* Right & Bottom Panels Container */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        
        {/* Right Panel: Live Output */}
        <Card className="bg-[#1C2333]/80 border-border/50 backdrop-blur-md shadow-2xl relative overflow-hidden">
          {/* Subtle glow effect behind card */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 rounded-xl z-0 pointer-events-none opacity-50"></div>
          
          <CardHeader className="pb-2 relative z-10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-mono flex items-center gap-2">
                <span className="text-primary">LIVE</span> SIMULATION
                <span className="relative flex h-3 w-3 ml-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
              </CardTitle>
              <Badge variant="outline" className={cn(
                "border-2 font-mono text-xs uppercase tracking-wider px-3 py-1",
                feasibility === 'GREEN' ? "border-green-500/50 text-green-400 bg-green-500/10" :
                feasibility === 'AMBER' ? "border-amber-500/50 text-amber-400 bg-amber-500/10" :
                "border-red-500/50 text-red-400 bg-red-500/10"
              )}>
                {feasibility === 'GREEN' ? "Feasible" : feasibility === 'AMBER' ? "Tight Timeline" : "Not Feasible"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-4 relative z-10">
            {/* KPI grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/30 rounded-lg p-4 border border-white/5 flex flex-col items-center justify-center text-center group cursor-default transition-all hover:bg-black/50 hover:border-primary/30">
                <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Raw Material Cost</span>
                <span className="text-3xl font-mono tracking-tighter text-white">
                  ${rawMaterialCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
                <span className="text-[10px] text-muted-foreground mt-2">Est. based on current yields</span>
              </div>
              
              <div className="bg-black/30 rounded-lg p-4 border border-white/5 flex flex-col items-center justify-center text-center group cursor-default transition-all hover:bg-black/50 hover:border-secondary/30">
                <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Production Time</span>
                <span className="text-3xl font-mono tracking-tighter text-white">
                  {productionTime.toFixed(1)} <span className="text-lg text-muted-foreground">hrs</span>
                </span>
                <span className="text-[10px] text-muted-foreground mt-2">{((productionTime)/24).toFixed(1)} Days continuous processing</span>
              </div>
            </div>

            {/* Price & Margin Slider */}
            <div className="bg-primary/5 rounded-lg p-5 border border-primary/20">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-primary">Pricing Model</h4>
                  <p className="text-xs text-muted-foreground mt-1">Adjust margin to dictate unit price</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-mono text-white">
                    ${suggestedPrice.toFixed(2)}/kg
                  </div>
                  <div className="text-xs text-primary font-mono mt-0.5">
                    Order Val: ${(totalValue/1000).toFixed(1)}k
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Target Margin</span>
                  <span className="text-sm font-mono font-bold bg-black/40 px-2 py-1 rounded border border-white/5">{margin}%</span>
                </div>
                <Slider 
                  value={[margin]} 
                  min={15} 
                  max={60} 
                  step={1} 
                  onValueChange={(val) => setMargin(Array.isArray(val) ? val[0] : val as unknown as number)}
                  className="py-1"
                />
              </div>
            </div>

            {/* Warnings */}
            {feasibility !== "GREEN" && (
              <div className={cn(
                "rounded-lg p-3 text-sm flex items-start gap-3 border",
                feasibility === "AMBER" ? "bg-amber-500/10 border-amber-500/20 text-amber-200" : "bg-red-500/10 border-red-500/20 text-red-200"
              )}>
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{feasibility === "AMBER" ? "Schedule Risk detected" : "Production timeline exceeded"}</p>
                  <p className="text-xs mt-1 opacity-80">3 other orders in same production window. Requires reprioritization or overtime shifts.</p>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="bg-black/20 border-t border-border/50 py-4 gap-3 relative z-10 flex-col sm:flex-row">
            <Button variant="outline" className="w-full sm:w-auto bg-black/40 border-border/50 hover:bg-black/60 font-mono text-xs uppercase tracking-wider h-10">
              <FileText className="mr-2 h-4 w-4" /> Save Sim
            </Button>
            <Button className="w-full font-mono text-sm uppercase tracking-wider h-10 shadow-[0_0_15px_rgba(0,212,170,0.3)] hover:shadow-[0_0_20px_rgba(0,212,170,0.5)] transition-all">
              <PackageCheck className="mr-2 h-4 w-4" /> Convert to Work Order
            </Button>
          </CardFooter>
        </Card>

        {/* Bottom Panel: Quality Matrix */}
        <Card className="flex-1 bg-[#161B25]/80 border-border/50 shadow-lg min-h-[300px] flex flex-col">
          <CardHeader className="pb-3 pt-5 border-b border-border/50 bg-black/10">
            <CardTitle className="text-sm font-mono uppercase tracking-wider flex items-center justify-between">
              <span>Quality Spec Matrix</span>
              {selectedSku && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: selectedSku.rgb }}></div>
                  <span className="text-xs text-muted-foreground">{selectedSku.skuCode} ({selectedSku.ciName})</span>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-auto custom-scrollbar">
            {selectedSku ? (
              <Table>
                <TableHeader className="bg-black/20 sticky top-0 z-10">
                  <TableRow className="border-border/30 hover:bg-transparent">
                    <TableHead className="w-[180px] text-xs uppercase tracking-wider text-muted-foreground font-semibold">Parameter</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold text-center">Req. Min</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold text-center">Req. Max</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-primary font-semibold text-center bg-primary/5">Capability</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold text-center">Status</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {specs.map((s, i) => (
                    <TableRow key={i} className="border-border/20 hover:bg-white/5 transition-colors">
                      <TableCell className="font-medium text-sm">{s.parameter}</TableCell>
                      <TableCell className="text-center text-muted-foreground font-mono text-xs">{s.minRequired ?? '—'}</TableCell>
                      <TableCell className="text-center text-muted-foreground font-mono text-xs">{s.maxAllowed ?? '—'}</TableCell>
                      <TableCell className="text-center font-mono font-bold bg-primary/5 text-sm">{s.currentCapability}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={cn(
                          "uppercase text-[10px] tracking-wider px-2 py-0",
                          s.status === 'Pass' && "border-green-500/50 text-green-400",
                          s.status === 'Borderline' && "border-amber-500/50 text-amber-400",
                          s.status === 'Fail' && "border-red-500/50 text-red-400"
                        )}>
                          {s.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[150px] truncate" title={s.notes}>
                        {s.notes}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center bg-black/5">
                <Palette className="h-10 w-10 mb-3 opacity-20" />
                <p className="text-sm">Select a Valid SKU to Generate Quality Specification Matrix</p>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
