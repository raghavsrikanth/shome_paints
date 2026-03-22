"use client";

import { useState } from "react";
import { 
  Menu, X, FlaskConical, Factory, Palette, 
  BarChart3, Package, Bell, Search, Settings, Webhook
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type ModuleType = "simulation" | "pipeline" | "sku-library" | "analytics" | "inventory";



const NAV_ITEMS = [
  { id: "simulation", label: "Order Simulation", icon: FlaskConical },
  { id: "pipeline", label: "Production Pipeline", icon: Factory },
  { id: "sku-library", label: "SKU Library", icon: Palette },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "inventory", label: "Inventory", icon: Package },
] as const;

export function DashboardLayout({ children, currentModule, onNavigate }: { children: React.ReactNode, currentModule: ModuleType, onNavigate: (module: ModuleType) => void }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-foreground selection:bg-primary/30">
      {/* Sidebar */}
      <aside 
        className={cn(
          "flex flex-col border-r border-border bg-popover/50 backdrop-blur-md transition-all duration-300 ease-in-out z-20",
          isCollapsed ? "w-[64px]" : "w-[240px]"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          {!isCollapsed && (
            <div className="flex items-center gap-2 overflow-hidden">
              <Webhook className="h-6 w-6 text-primary flex-shrink-0" />
              <span className="font-mono text-sm font-bold truncate tracking-tighter">CHROMA<span className="text-primary">CORE</span></span>
            </div>
          )}
          {isCollapsed && (
            <Webhook className="h-6 w-6 text-primary mx-auto flex-shrink-0" />
          )}
        </div>

        <nav className="flex-1 space-y-2 py-6 px-3 h-full overflow-y-auto overflow-x-hidden">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentModule === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as ModuleType)}
                title={isCollapsed ? item.label : undefined}
                className={cn(
                  "flex items-center w-full gap-3 rounded-md px-3 py-2.5 transition-colors group",
                  isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-primary drop-shadow-[0_0_8px_rgba(0,212,170,0.5)]" : "text-muted-foreground group-hover:text-foreground")} />
                {!isCollapsed && (
                  <span className="text-sm truncate">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-border mt-auto">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex w-full items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-white/5 transition-colors"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-popover/30 backdrop-blur-sm z-10 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="font-mono text-lg font-semibold capitalize tracking-tight">
              {NAV_ITEMS.find((n) => n.id === currentModule)?.label}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:flex items-center">
              <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search SKUs, Batches..." 
                className="h-9 w-64 rounded-full bg-black/20 border border-border pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground"
              />
            </div>
            
            <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-white/5">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-secondary"></span>
            </button>
            
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-white/5">
              <Settings className="h-5 w-5" />
            </button>
            
            <div className="h-6 w-px bg-border mx-1"></div>
            
            <div className="flex items-center gap-3 ml-1 cursor-pointer">
              <div className="hidden md:flex flex-col items-end leading-none">
                <span className="text-sm font-medium">Eleanor Vance</span>
                <span className="text-xs text-muted-foreground font-mono mt-1">COO</span>
              </div>
              <Avatar className="h-8 w-8 border border-border">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary/20 text-primary font-mono text-xs">EV</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-auto p-6 bg-gradient-to-br from-background via-background to-popover/20 relative">
          <div className="max-w-[1400px] mx-auto h-full space-y-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
