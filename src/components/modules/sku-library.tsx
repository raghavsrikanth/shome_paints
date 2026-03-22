"use client";

import { useState, useMemo } from "react";
import { 
  Search, SlidersHorizontal, Settings2, ArrowRight, Save, LayoutGrid, List, Beaker,
  TrendingDown, TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MOCK_SKUS } from "@/lib/mock-data";
import { IndustryApplication, PigmentFamily, PigmentSKU, QualityTier } from "@/lib/types";

const INDUSTRIES: IndustryApplication[] = ["Paints", "Inks", "Print", "Textile", "Seed Colorizing"];
const FAMILIES: PigmentFamily[] = ["Azo Yellow", "Azo Red", "Phthalocyanine Blue", "Phthalocyanine Green", "Dioxazine Violet", "Carbon Black", "Titanium White", "Iron Oxide", "Others"];
const TIERS: QualityTier[] = ["Standard", "Premium", "Ultra-Premium"];

export function SkuLibraryModule() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState<IndustryApplication | "All">("All");
  const [familyFilter, setFamilyFilter] = useState<PigmentFamily | "All">("All");
  const [tierFilter, setTierFilter] = useState<QualityTier | "All">("All");
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]); // $/kg

  // Formulation Modal State
  const [selectedSku, setSelectedSku] = useState<PigmentSKU | null>(null);
  const [dcbGrade, setDcbGrade] = useState<'Standard' | 'Premium' | 'N/A'>('Standard');
  const [amxGrade, setAmxGrade] = useState<'Standard' | 'Premium' | 'N/A'>('Standard');

  const filteredSkus = useMemo(() => {
    return MOCK_SKUS.filter(sku => {
      const matchSearch = sku.name.toLowerCase().includes(searchQuery.toLowerCase()) || sku.skuCode.toLowerCase().includes(searchQuery.toLowerCase());
      const matchInd = industryFilter === "All" || sku.supportedIndustries.includes(industryFilter as IndustryApplication);
      const matchFam = familyFilter === "All" || sku.family === familyFilter;
      const matchTier = tierFilter === "All" || sku.qualityTier === tierFilter;
      const matchPrice = sku.sellingPrice >= priceRange[0] && sku.sellingPrice <= priceRange[1];
      return matchSearch && matchInd && matchFam && matchTier && matchPrice;
    });
  }, [searchQuery, industryFilter, familyFilter, tierFilter, priceRange]);

  const openFormulation = (sku: PigmentSKU) => {
    setSelectedSku(sku);
    setDcbGrade(sku.dcbGrade);
    setAmxGrade(sku.amxGrade);
  };

  // Mock formulation recalculation
  const simulatedCost = useMemo(() => {
    if (!selectedSku) return 0;
    let base = selectedSku.baseCost;
    if (selectedSku.dcbGrade !== 'N/A' && selectedSku.dcbGrade !== dcbGrade) {
      base += dcbGrade === 'Premium' ? +3.0 : -3.0;
    }
    if (selectedSku.amxGrade !== 'N/A' && selectedSku.amxGrade !== amxGrade) {
      base += amxGrade === 'Premium' ? +4.5 : -4.5;
    }
    return Math.max(1, base);
  }, [selectedSku, dcbGrade, amxGrade]);

  const simulatedQuality = useMemo(() => {
    if (!selectedSku) return { lf: 0, tr: 0 };
    let lf = selectedSku.lightfastness;
    let tr = selectedSku.transparency;
    
    // Changing standard -> premium boosts stats
    if (selectedSku.dcbGrade === 'Standard' && dcbGrade === 'Premium') lf = Math.min(8, lf + 1);
    if (selectedSku.dcbGrade === 'Premium' && dcbGrade === 'Standard') lf = Math.max(1, lf - 1);
    
    if (selectedSku.amxGrade === 'Standard' && amxGrade === 'Premium') tr = Math.min(100, tr + 15);
    if (selectedSku.amxGrade === 'Premium' && amxGrade === 'Standard') tr = Math.max(0, tr - 15);

    return { lf, tr };
  }, [selectedSku, dcbGrade, amxGrade]);

  return (
    <div className="flex flex-col gap-6 h-full pb-4">
      
      {/* Filters Bar */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 shadow-lg flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 space-y-2 w-full">
          <label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Search className="h-3 w-3"/> Search Library</label>
          <Input 
            placeholder="Search SKU code or name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-black/20 border-border/50 h-9"
          />
        </div>
        
        <div className="space-y-2 w-full md:w-40">
          <label className="text-xs uppercase tracking-wider text-muted-foreground">Industry</label>
          <Select value={industryFilter} onValueChange={(v) => setIndustryFilter(v as IndustryApplication | "All")}>
            <SelectTrigger className="bg-black/20 border-border/50 h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Industries</SelectItem>
              {INDUSTRIES.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 w-full md:w-40">
          <label className="text-xs uppercase tracking-wider text-muted-foreground">Family</label>
          <Select value={familyFilter} onValueChange={(v) => setFamilyFilter(v as PigmentFamily | "All")}>
            <SelectTrigger className="bg-black/20 border-border/50 h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Families</SelectItem>
              {FAMILIES.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 w-full md:w-36">
          <label className="text-xs uppercase tracking-wider text-muted-foreground">Quality</label>
          <Select value={tierFilter} onValueChange={(v) => setTierFilter(v as QualityTier | "All")}>
            <SelectTrigger className="bg-black/20 border-border/50 h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Tiers</SelectItem>
              {TIERS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3 w-full md:w-48 px-2 hidden lg:block">
          <div className="flex justify-between items-center text-xs uppercase tracking-wider text-muted-foreground">
            <label>Price Range</label>
            <span className="font-mono text-[10px]">${priceRange[0]} - ${priceRange[1]}</span>
          </div>
          <Slider 
            value={priceRange} 
            min={0} max={100} step={5} 
            onValueChange={(val) => setPriceRange(val as number[])}
          />
        </div>

        <div className="flex bg-black/30 p-1 rounded-md border border-border/50 w-full md:w-auto mt-2 md:mt-0">
          <button 
            onClick={() => setViewMode("table")}
            className={cn("p-1.5 rounded transition-all flex-1 md:flex-none flex justify-center", viewMode === "table" ? "bg-primary/20 text-primary shadow" : "text-muted-foreground hover:text-white")}
          >
            <List className="h-4 w-4" />
          </button>
          <button 
            onClick={() => setViewMode("grid")}
            className={cn("p-1.5 rounded transition-all flex-1 md:flex-none flex justify-center", viewMode === "grid" ? "bg-primary/20 text-primary shadow" : "text-muted-foreground hover:text-white")}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-[#161B25]/80 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg overflow-hidden flex flex-col relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="p-4 border-b border-border/30 flex justify-between items-center bg-black/10">
          <h2 className="font-mono text-sm uppercase tracking-wider flex items-center gap-2">
            <Beaker className="h-4 w-4 text-primary" /> SKU Database <span className="text-muted-foreground ml-2">({filteredSkus.length} matched)</span>
          </h2>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar p-2">
          {filteredSkus.length === 0 ? (
            <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground">
              <Search className="h-12 w-12 mb-4 opacity-20" />
              <p>No SKUs match the current filter criteria.</p>
              <Button variant="link" onClick={() => {
                setSearchQuery(""); setIndustryFilter("All"); setFamilyFilter("All"); setTierFilter("All"); setPriceRange([0, 100]);
              }}>Clear Filters</Button>
            </div>
          ) : viewMode === "table" ? (
            <Table>
              <TableHeader className="bg-black/20 sticky top-0 z-10">
                <TableRow className="border-border/20 hover:bg-transparent">
                  <TableHead className="w-[250px] text-xs uppercase tracking-wider">SKU / Color</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider">Family</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider">Quality</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-right">Cost ($)</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-right">Price ($)</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-right">Stock (kg)</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSkus.map((sku) => {
                  const marginPct = ((sku.sellingPrice - sku.baseCost) / sku.sellingPrice) * 100;
                  const isLowStock = sku.stockAvailable <= sku.reorderThreshold;

                  return (
                    <TableRow key={sku.id} className="border-border/10 hover:bg-white/5 cursor-pointer group" onClick={() => openFormulation(sku)}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full border border-white/20 shadow-sm shrink-0" style={{ backgroundColor: sku.rgb }}></div>
                          <div className="flex flex-col">
                            <span className="font-medium text-white truncate max-w-[180px]">{sku.name}</span>
                            <span className="text-xs text-muted-foreground font-mono">{sku.skuCode} • {sku.ciName}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{sku.family}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(
                          "uppercase text-[10px] tracking-wider font-mono",
                          sku.qualityTier === 'Ultra-Premium' ? "border-amber-500/30 text-amber-400 bg-amber-500/5" :
                          sku.qualityTier === 'Premium' ? "border-primary/30 text-primary bg-primary/5" : "border-white/10 text-muted-foreground"
                        )}>
                          {sku.qualityTier}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">${sku.baseCost.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end">
                          <span className="font-mono text-sm text-white">${sku.sellingPrice.toFixed(2)}</span>
                          <span className="text-[10px] text-primary">{marginPct.toFixed(0)}% mgn</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                         <div className="flex flex-col items-end">
                          <span className={cn("font-mono text-sm font-medium", isLowStock ? "text-red-400" : "text-white")}>
                            {sku.stockAvailable.toLocaleString()}
                          </span>
                          {isLowStock && <span className="text-[10px] text-red-500">Reorder Req.</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Settings2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
              {filteredSkus.map(sku => {
                const isLowStock = sku.stockAvailable <= sku.reorderThreshold;
                const marginPct = ((sku.sellingPrice - sku.baseCost) / sku.sellingPrice) * 100;

                return (
                  <Card key={sku.id} className="bg-black/20 border-border/50 hover:border-primary/50 transition-colors cursor-pointer group" onClick={() => openFormulation(sku)}>
                    <CardContent className="p-5 flex flex-col h-full gap-4">
                      <div className="flex justify-between items-start">
                        <div className="w-12 h-12 rounded-full border border-white/20 shadow-md transform group-hover:scale-110 transition-transform" style={{ backgroundColor: sku.rgb }}></div>
                        <Badge variant="outline" className={cn(
                          "uppercase text-[9px] tracking-wider",
                          sku.qualityTier === 'Ultra-Premium' ? "border-amber-500/30 text-amber-400" :
                          sku.qualityTier === 'Premium' ? "border-primary/30 text-primary" : "border-white/10 text-muted-foreground"
                        )}>
                          {sku.qualityTier}
                        </Badge>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-white leading-tight mb-1 group-hover:text-primary transition-colors">{sku.name}</h3>
                        <p className="text-xs text-muted-foreground font-mono">{sku.skuCode} • {sku.ciName}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs mt-auto bg-black/30 p-2 rounded border border-white/5">
                        <div className="flex flex-col">
                          <span className="text-muted-foreground uppercase text-[9px] tracking-wider">Cost</span>
                          <span className="font-mono text-white">${sku.baseCost.toFixed(2)}/kg</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-muted-foreground uppercase text-[9px] tracking-wider">Price</span>
                          <span className="font-mono text-primary">${sku.sellingPrice.toFixed(2)}/kg</span>
                        </div>
                        <div className="flex flex-col mt-1 pt-2 border-t border-white/5">
                          <span className="text-muted-foreground uppercase text-[9px] tracking-wider">LF/TR</span>
                          <span className="font-mono text-white">{sku.lightfastness} / {sku.transparency}%</span>
                        </div>
                        <div className="flex flex-col mt-1 pt-2 border-t border-white/5">
                          <span className="text-muted-foreground uppercase text-[9px] tracking-wider">Stock</span>
                          <span className={cn("font-mono", isLowStock ? "text-red-400" : "text-white")}>{sku.stockAvailable.toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Edit Formulation Modal */}
      <Dialog open={!!selectedSku} onOpenChange={(open) => !open && setSelectedSku(null)}>
        {selectedSku && (
          <DialogContent className="sm:max-w-[700px] bg-[#161B25] border-border shadow-2xl">
            <DialogHeader className="border-b border-border/50 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <DialogTitle className="flex items-center gap-3 font-mono text-lg">
                    <div className="w-5 h-5 rounded-full border border-white/20 shadow-sm shrink-0" style={{ backgroundColor: selectedSku.rgb }}></div>
                    {selectedSku.skuCode} Formulation
                  </DialogTitle>
                  <DialogDescription className="mt-1">{selectedSku.name} • {selectedSku.ciName} • RGB: {selectedSku.rgb}</DialogDescription>
                </div>
                <Badge className={cn(
                  selectedSku.qualityTier === 'Ultra-Premium' ? "bg-amber-500/20 text-amber-500" :
                  selectedSku.qualityTier === 'Premium' ? "bg-primary/20 text-primary" : "bg-white/10 text-white"
                )}>{selectedSku.qualityTier}</Badge>
              </div>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              
              {/* Left: Component Swaps */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2"><FiltersIcon /> Raw Material Grades</h4>
                  
                  <div className="space-y-4">
                    <div className="bg-black/30 p-3 rounded-lg border border-white/5 space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Coupling Component (DCB)</span>
                      </div>
                      <Select 
                        value={dcbGrade} 
                        onValueChange={(v) => setDcbGrade(v as any)}
                        disabled={selectedSku.dcbGrade === 'N/A'}
                      >
                        <SelectTrigger className="bg-black/40 border-border/50 h-9 font-mono text-xs">
                          <SelectValue placeholder="Select Grade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Standard">Standard (+0LF, +$0.00)</SelectItem>
                          <SelectItem value="Premium">Premium Grade (+1LF, +$3.00)</SelectItem>
                        </SelectContent>
                      </Select>
                      {selectedSku.dcbGrade === 'N/A' && <p className="text-[10px] text-muted-foreground">Not applicable for this chemical family.</p>}
                    </div>

                    <div className="bg-black/30 p-3 rounded-lg border border-white/5 space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Diazo Component (AMX)</span>
                      </div>
                      <Select 
                        value={amxGrade} 
                        onValueChange={(v) => setAmxGrade(v as any)}
                        disabled={selectedSku.amxGrade === 'N/A'}
                      >
                        <SelectTrigger className="bg-black/40 border-border/50 h-9 font-mono text-xs">
                          <SelectValue placeholder="Select Grade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Standard">Standard (+0% TR, +$0.00)</SelectItem>
                          <SelectItem value="Premium">High-Gloss Grade (+15% TR, +$4.50)</SelectItem>
                        </SelectContent>
                      </Select>
                      {selectedSku.amxGrade === 'N/A' && <p className="text-[10px] text-muted-foreground">Not applicable for this chemical family.</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Simulation Results */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 flex flex-col">
                <h4 className="text-xs uppercase tracking-wider text-primary mb-4 flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  Impact Simulation
                </h4>
                
                <div className="space-y-4 flex-1">
                  
                  {/* Cost Impact */}
                  <div className="flex justify-between items-center bg-black/40 p-3 rounded border border-white/5">
                    <span className="text-sm text-muted-foreground">Base Cost / kg</span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-muted-foreground line-through text-xs">${selectedSku.baseCost.toFixed(2)}</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <span className={cn(
                        "text-lg font-bold", 
                        simulatedCost > selectedSku.baseCost ? "text-red-400" : simulatedCost < selectedSku.baseCost ? "text-green-400" : "text-white"
                      )}>
                        ${Math.abs(simulatedCost).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Quality Shifts */}
                    <div className="bg-black/40 p-3 rounded border border-white/5 text-center flex flex-col justify-center items-center">
                      <span className="text-[10px] uppercase text-muted-foreground tracking-wider mb-1">Lightfastness</span>
                      <div className="flex items-center gap-1 font-mono">
                        <span className="text-muted-foreground text-xs">{selectedSku.lightfastness}</span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span className={cn(
                          "text-lg", 
                          simulatedQuality.lf > selectedSku.lightfastness ? "text-green-400 flex items-center gap-1" : 
                          simulatedQuality.lf < selectedSku.lightfastness ? "text-red-400 flex items-center gap-1" : "text-white"
                        )}>
                          {simulatedQuality.lf}
                          {simulatedQuality.lf > selectedSku.lightfastness && <TrendingUp className="h-3 w-3" />}
                          {simulatedQuality.lf < selectedSku.lightfastness && <TrendingDown className="h-3 w-3" />}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-black/40 p-3 rounded border border-white/5 text-center flex flex-col justify-center items-center">
                      <span className="text-[10px] uppercase text-muted-foreground tracking-wider mb-1">Transparency</span>
                      <div className="flex items-center gap-1 font-mono">
                        <span className="text-muted-foreground text-xs">{selectedSku.transparency}%</span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span className={cn(
                          "text-lg", 
                          simulatedQuality.tr > selectedSku.transparency ? "text-green-400 flex items-center gap-1" : 
                          simulatedQuality.tr < selectedSku.transparency ? "text-red-400 flex items-center gap-1" : "text-white"
                        )}>
                          {simulatedQuality.tr}%
                          {simulatedQuality.tr > selectedSku.transparency && <TrendingUp className="h-3 w-3" />}
                          {simulatedQuality.tr < selectedSku.transparency && <TrendingDown className="h-3 w-3" />}
                        </span>
                      </div>
                    </div>
                  </div>

                  {simulatedCost !== selectedSku.baseCost && (
                    <div className="text-xs text-amber-400 bg-amber-500/10 p-2 rounded border border-amber-500/20 mt-4 leading-relaxed">
                      <strong>Note:</strong> Adjusting grades modifies the base cost. The system will prompt you to recalculate suggested selling prices if you save this formulation as default.
                    </div>
                  )}

                </div>
              </div>
            </div>

            <DialogFooter className="border-t border-border/50 pt-4 px-0">
              <Button variant="ghost" onClick={() => setSelectedSku(null)}>Cancel</Button>
              <Button className="font-mono uppercase tracking-wider text-xs" onClick={() => setSelectedSku(null)}>
                <Save className="mr-2 h-4 w-4" /> Save Formulation
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

function FiltersIcon() {
  return <SlidersHorizontal className="h-4 w-4" />
}
