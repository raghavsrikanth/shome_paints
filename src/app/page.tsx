"use client";

import { useState } from "react";
import { DashboardLayout, ModuleType } from "@/components/layout/dashboard-layout";

// Module placeholders
import { OrderSimulationModule } from "@/components/modules/order-simulation";
import { PipelineTrackerModule } from "@/components/modules/pipeline-tracker";
import { SkuLibraryModule } from "@/components/modules/sku-library";
import { AnalyticsModule } from "@/components/modules/analytics";
import { InventoryModule } from "@/components/modules/inventory";

export default function Dashboard() {
  const [activeModule, setActiveModule] = useState<ModuleType>("simulation");

  return (
    <DashboardLayout currentModule={activeModule} onNavigate={setActiveModule}>
      {activeModule === "simulation" && <OrderSimulationModule />}
      {activeModule === "pipeline" && <PipelineTrackerModule />}
      {activeModule === "sku-library" && <SkuLibraryModule />}
      {activeModule === "analytics" && <AnalyticsModule />}
      {activeModule === "inventory" && <InventoryModule />}
    </DashboardLayout>
  );
}
