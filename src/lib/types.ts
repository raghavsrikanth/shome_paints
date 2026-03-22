export type IndustryApplication = 'Paints' | 'Inks' | 'Print' | 'Textile' | 'Seed Colorizing';
export type PigmentFamily = 'Azo Yellow' | 'Azo Red' | 'Phthalocyanine Blue' | 'Phthalocyanine Green' | 'Dioxazine Violet' | 'Carbon Black' | 'Titanium White' | 'Iron Oxide' | 'Others';
export type QualityTier = 'Standard' | 'Premium' | 'Ultra-Premium';
export type PipelineStage = 'Precipitation' | 'Filter Press' | 'Washing' | 'Drying' | 'Finishing' | 'Dispatch';
export type MachineStatus = 'Running' | 'Idle' | 'Maintenance' | 'Warning';
export type OrderFeasibility = 'GREEN' | 'AMBER' | 'RED';

export interface PigmentSKU {
  id: string;
  skuCode: string;
  name: string;
  family: PigmentFamily;
  ciName: string; // Colour Index Name
  rgb: string; // Hex code
  baseCost: number; // $/kg
  sellingPrice: number; // $/kg
  dcbGrade: 'Standard' | 'Premium' | 'N/A';
  amxGrade: 'Standard' | 'Premium' | 'N/A';
  transparency: number; // 0-100
  lightfastness: number; // 1-8
  heatResistance: number; // °C
  oilAbsorption: number; // g/100g
  moistureContent: number; // %
  tintingStrength: number; // %
  stockAvailable: number; // kg
  reorderThreshold: number; // kg
  supportedIndustries: IndustryApplication[];
  qualityTier: QualityTier;
}

export interface SpecificationRequirement {
  parameter: string;
  minRequired: number | null;
  maxAllowed: number | null;
  currentCapability: number;
  status: 'Pass' | 'Fail' | 'Borderline';
  notes: string;
}

export interface ProductionBatch {
  id: string;
  skuId: string;
  skuName: string;
  stage: PipelineStage;
  completionPercentage: number;
  throughputRate: number; // kg/hr
  yieldLossPercentage: number;
  machineStatus: MachineStatus;
  startedAt: string; // ISO date string
  estimatedCompletion: string; // ISO date string
  priority: 'High' | 'Normal' | 'Low';
  inputKg: number;
  outputKg: number;
}

export interface SimulatedOrder {
  id: string;
  customerName: string;
  industry: IndustryApplication;
  pigmentFamily: PigmentFamily;
  skuId: string;
  quantityRequired: number; // kg
  deliveryDate: string; // ISO date string
  qualityTier: QualityTier;
  estimatedRawMaterialCost: number;
  estimatedProductionTime: number; // hours
  suggestedPricePerKg: number; // based on margin
  feasibility: OrderFeasibility;
  competingOrdersWarning: string | null;
  specifications: SpecificationRequirement[];
}

export interface RawMaterialStock {
  id: string;
  materialName: string;
  grade: 'Standard' | 'Premium' | 'Rutile' | 'Anatase' | 'Industrial' | 'N/A';
  stockKg: number;
  reorderPoint: number; // kg
  daysUntilStockout: number;
  supplier: string;
  lastPricePerKg: number;
  status: 'Healthy' | 'Low' | 'Critical';
}

export interface ThroughputData {
  date: string;
  [skuLabel: string]: number | string; // Allows dynamic SKU keys for stacked bars
}

export interface YieldLossData {
  week: string;
  Precipitation: number;
  FilterPress: number;
  Washing: number;
  Drying: number;
  Finishing: number;
}
