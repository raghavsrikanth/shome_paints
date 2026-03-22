import { 
  PigmentSKU, 
  ProductionBatch, 
  RawMaterialStock, 
  ThroughputData, 
  YieldLossData,
  SimulatedOrder 
} from './types';

// Mock SKUs
export const MOCK_SKUS: PigmentSKU[] = [
  {
    id: "sku-001", skuCode: "PY13-STD", name: "Road Marking Yellow (Standard)", family: "Azo Yellow", ciName: "Yellow 13", rgb: "#FFD700",
    baseCost: 4.20, sellingPrice: 6.80, dcbGrade: "Standard", amxGrade: "Standard", transparency: 45, lightfastness: 5, heatResistance: 160,
    oilAbsorption: 42, moistureContent: 1.2, tintingStrength: 95, stockAvailable: 12000, reorderThreshold: 5000, supportedIndustries: ['Paints'], qualityTier: "Standard"
  },
  {
    id: "sku-002", skuCode: "PY13-PRM", name: "Road Marking Yellow (Premium)", family: "Azo Yellow", ciName: "Yellow 13", rgb: "#FFDF33",
    baseCost: 7.50, sellingPrice: 12.00, dcbGrade: "Premium", amxGrade: "Standard", transparency: 55, lightfastness: 6, heatResistance: 180,
    oilAbsorption: 38, moistureContent: 0.8, tintingStrength: 105, stockAvailable: 4500, reorderThreshold: 2000, supportedIndustries: ['Paints', 'Print'], qualityTier: "Premium"
  },
  {
    id: "sku-003", skuCode: "PY83-ULT", name: "High-Perf Yellow 83", family: "Azo Yellow", ciName: "Yellow 83", rgb: "#FFB000",
    baseCost: 17.00, sellingPrice: 28.50, dcbGrade: "Premium", amxGrade: "Premium", transparency: 85, lightfastness: 7, heatResistance: 220,
    oilAbsorption: 55, moistureContent: 0.5, tintingStrength: 120, stockAvailable: 800, reorderThreshold: 1000, supportedIndustries: ['Inks', 'Textile'], qualityTier: "Ultra-Premium"
  },
  {
    id: "sku-004", skuCode: "PR57-STD", name: "Lithol Rubine Red", family: "Azo Red", ciName: "Red 57:1", rgb: "#E30022",
    baseCost: 6.00, sellingPrice: 9.50, dcbGrade: "N/A", amxGrade: "N/A", transparency: 60, lightfastness: 4, heatResistance: 150,
    oilAbsorption: 48, moistureContent: 1.5, tintingStrength: 100, stockAvailable: 8500, reorderThreshold: 3000, supportedIndustries: ['Print', 'Inks'], qualityTier: "Standard"
  },
  {
    id: "sku-005", skuCode: "PR122-PRM", name: "Quinacridone Magenta", family: "Azo Red", ciName: "Red 122", rgb: "#FF0090",
    baseCost: 22.00, sellingPrice: 38.00, dcbGrade: "N/A", amxGrade: "N/A", transparency: 90, lightfastness: 8, heatResistance: 280,
    oilAbsorption: 60, moistureContent: 0.3, tintingStrength: 130, stockAvailable: 1200, reorderThreshold: 800, supportedIndustries: ['Paints', 'Inks', 'Textile'], qualityTier: "Ultra-Premium"
  },
  {
    id: "sku-006", skuCode: "PB15-STD", name: "Phthalo Blue Alpha", family: "Phthalocyanine Blue", ciName: "Blue 15:1", rgb: "#000F89",
    baseCost: 8.50, sellingPrice: 14.00, dcbGrade: "N/A", amxGrade: "N/A", transparency: 70, lightfastness: 8, heatResistance: 200,
    oilAbsorption: 30, moistureContent: 1.0, tintingStrength: 110, stockAvailable: 15000, reorderThreshold: 5000, supportedIndustries: ['Paints', 'Print', 'Seed Colorizing'], qualityTier: "Standard"
  },
  {
    id: "sku-007", skuCode: "PB15-PRM", name: "Phthalo Blue Beta", family: "Phthalocyanine Blue", ciName: "Blue 15:3", rgb: "#0033A0",
    baseCost: 11.00, sellingPrice: 18.50, dcbGrade: "N/A", amxGrade: "N/A", transparency: 85, lightfastness: 8, heatResistance: 280,
    oilAbsorption: 35, moistureContent: 0.5, tintingStrength: 125, stockAvailable: 6000, reorderThreshold: 3000, supportedIndustries: ['Inks', 'Textile'], qualityTier: "Premium"
  },
  {
    id: "sku-008", skuCode: "PG7-STD", name: "Phthalo Green", family: "Phthalocyanine Green", ciName: "Green 7", rgb: "#00A86B",
    baseCost: 12.00, sellingPrice: 20.00, dcbGrade: "N/A", amxGrade: "N/A", transparency: 80, lightfastness: 8, heatResistance: 260,
    oilAbsorption: 32, moistureContent: 0.8, tintingStrength: 115, stockAvailable: 4000, reorderThreshold: 1500, supportedIndustries: ['Paints', 'Inks', 'Print'], qualityTier: "Standard"
  },
  {
    id: "sku-009", skuCode: "PV23-PRM", name: "Carbazole Violet", family: "Dioxazine Violet", ciName: "Violet 23", rgb: "#5C246E",
    baseCost: 28.00, sellingPrice: 48.00, dcbGrade: "N/A", amxGrade: "N/A", transparency: 88, lightfastness: 8, heatResistance: 280,
    oilAbsorption: 45, moistureContent: 0.4, tintingStrength: 140, stockAvailable: 500, reorderThreshold: 300, supportedIndustries: ['Paints', 'Inks'], qualityTier: "Premium"
  },
  {
    id: "sku-010", skuCode: "PW6-RUT", name: "Titanium Dioxide Rutile", family: "Titanium White", ciName: "White 6", rgb: "#F4F6F6",
    baseCost: 3.50, sellingPrice: 5.20, dcbGrade: "N/A", amxGrade: "N/A", transparency: 5, lightfastness: 8, heatResistance: 300,
    oilAbsorption: 20, moistureContent: 0.2, tintingStrength: 100, stockAvailable: 50000, reorderThreshold: 20000, supportedIndustries: ['Paints', 'Inks', 'Print', 'Textile'], qualityTier: "Standard"
  },
  {
    id: "sku-011", skuCode: "PY65-PRM", name: "Arylide Yellow 65", family: "Azo Yellow", ciName: "Yellow 65", rgb: "#FFC200",
    baseCost: 7.00, sellingPrice: 12.50, dcbGrade: "Premium", amxGrade: "Standard", transparency: 60, lightfastness: 6, heatResistance: 170,
    oilAbsorption: 40, moistureContent: 1.0, tintingStrength: 100, stockAvailable: 2500, reorderThreshold: 1000, supportedIndustries: ['Paints', 'Seed Colorizing'], qualityTier: "Premium"
  },
  {
    id: "sku-012", skuCode: "PY74-ULT", name: "Hansa Brilliant Yellow", family: "Azo Yellow", ciName: "Yellow 74", rgb: "#FFE02F",
    baseCost: 14.50, sellingPrice: 24.00, dcbGrade: "Premium", amxGrade: "Premium", transparency: 80, lightfastness: 7, heatResistance: 160,
    oilAbsorption: 30, moistureContent: 0.6, tintingStrength: 110, stockAvailable: 1500, reorderThreshold: 800, supportedIndustries: ['Inks', 'Print'], qualityTier: "Ultra-Premium"
  },
  {
    id: "sku-013", skuCode: "PR112-PRM", name: "Naphthol Red AS-D", family: "Azo Red", ciName: "Red 112", rgb: "#D11141",
    baseCost: 15.00, sellingPrice: 25.00, dcbGrade: "N/A", amxGrade: "Premium", transparency: 75, lightfastness: 6, heatResistance: 160,
    oilAbsorption: 45, moistureContent: 0.9, tintingStrength: 115, stockAvailable: 3100, reorderThreshold: 1500, supportedIndustries: ['Paints', 'Inks'], qualityTier: "Premium"
  },
  {
    id: "sku-014", skuCode: "PR254-ULT", name: "DPP Red (Ferrari)", family: "Others", ciName: "Red 254", rgb: "#CC0000",
    baseCost: 35.00, sellingPrice: 65.00, dcbGrade: "N/A", amxGrade: "N/A", transparency: 40, lightfastness: 8, heatResistance: 300,
    oilAbsorption: 50, moistureContent: 0.2, tintingStrength: 135, stockAvailable: 300, reorderThreshold: 200, supportedIndustries: ['Paints'], qualityTier: "Ultra-Premium"
  },
  {
    id: "sku-015", skuCode: "PB15:2-STD", name: "Phthalo Blue NCNF", family: "Phthalocyanine Blue", ciName: "Blue 15:2", rgb: "#0020A0",
    baseCost: 9.50, sellingPrice: 15.50, dcbGrade: "N/A", amxGrade: "N/A", transparency: 75, lightfastness: 8, heatResistance: 220,
    oilAbsorption: 33, moistureContent: 0.9, tintingStrength: 112, stockAvailable: 9000, reorderThreshold: 3000, supportedIndustries: ['Paints', 'Print'], qualityTier: "Standard"
  },
  {
    id: "sku-016", skuCode: "PG36-PRM", name: "Phthalo Green (Yellowish)", family: "Phthalocyanine Green", ciName: "Green 36", rgb: "#009E60",
    baseCost: 18.00, sellingPrice: 32.00, dcbGrade: "N/A", amxGrade: "N/A", transparency: 85, lightfastness: 8, heatResistance: 250,
    oilAbsorption: 30, moistureContent: 0.6, tintingStrength: 120, stockAvailable: 1200, reorderThreshold: 500, supportedIndustries: ['Inks', 'Textile'], qualityTier: "Premium"
  },
  {
    id: "sku-017", skuCode: "PBk7-STD", name: "Carbon Black", family: "Carbon Black", ciName: "Black 7", rgb: "#101010",
    baseCost: 2.50, sellingPrice: 4.80, dcbGrade: "N/A", amxGrade: "N/A", transparency: 10, lightfastness: 8, heatResistance: 300,
    oilAbsorption: 100, moistureContent: 2.0, tintingStrength: 150, stockAvailable: 25000, reorderThreshold: 10000, supportedIndustries: ['Paints', 'Inks', 'Print'], qualityTier: "Standard"
  },
  {
    id: "sku-018", skuCode: "PY3-STD", name: "Hansa Yellow 10G", family: "Azo Yellow", ciName: "Yellow 3", rgb: "#FFF200",
    baseCost: 5.50, sellingPrice: 9.00, dcbGrade: "Standard", amxGrade: "Standard", transparency: 70, lightfastness: 5, heatResistance: 140,
    oilAbsorption: 35, moistureContent: 1.1, tintingStrength: 95, stockAvailable: 6000, reorderThreshold: 2000, supportedIndustries: ['Print'], qualityTier: "Standard"
  },
  {
    id: "sku-019", skuCode: "PR2-STD", name: "Naphthol Red", family: "Azo Red", ciName: "Red 2", rgb: "#C20033",
    baseCost: 5.80, sellingPrice: 9.20, dcbGrade: "N/A", amxGrade: "Standard", transparency: 65, lightfastness: 4, heatResistance: 130,
    oilAbsorption: 42, moistureContent: 1.4, tintingStrength: 90, stockAvailable: 5500, reorderThreshold: 2000, supportedIndustries: ['Seed Colorizing', 'Print'], qualityTier: "Standard"
  },
  {
    id: "sku-020", skuCode: "PR170-PRM", name: "Naphthol Red F3RK", family: "Azo Red", ciName: "Red 170", rgb: "#E60000",
    baseCost: 12.00, sellingPrice: 20.00, dcbGrade: "N/A", amxGrade: "Premium", transparency: 70, lightfastness: 6, heatResistance: 200,
    oilAbsorption: 55, moistureContent: 0.7, tintingStrength: 125, stockAvailable: 2200, reorderThreshold: 1000, supportedIndustries: ['Paints', 'Inks'], qualityTier: "Premium"
  }
];

// Mock Batches Pipeline
export const MOCK_BATCHES: ProductionBatch[] = [
  { id: "B-2391", skuId: "sku-003", skuName: "High-Perf Yellow 83", stage: "Precipitation", completionPercentage: 65, throughputRate: 450, yieldLossPercentage: 1.2, machineStatus: "Running", startedAt: new Date(Date.now() - 3600000 * 2).toISOString(), estimatedCompletion: new Date(Date.now() + 3600000 * 4).toISOString(), priority: "High", inputKg: 2000, outputKg: 1976 },
  { id: "B-2392", skuId: "sku-007", skuName: "Phthalo Blue Beta", stage: "Precipitation", completionPercentage: 15, throughputRate: 600, yieldLossPercentage: 0.5, machineStatus: "Running", startedAt: new Date(Date.now() - 1800000).toISOString(), estimatedCompletion: new Date(Date.now() + 3600000 * 5.5).toISOString(), priority: "Normal", inputKg: 4000, outputKg: 3980 },
  { id: "B-2388", skuId: "sku-001", skuName: "Road Marking Yellow (Standard)", stage: "Filter Press", completionPercentage: 88, throughputRate: 1200, yieldLossPercentage: 2.1, machineStatus: "Running", startedAt: new Date(Date.now() - 3600000 * 6).toISOString(), estimatedCompletion: new Date(Date.now() + 3600000 * 1).toISOString(), priority: "Normal", inputKg: 5000, outputKg: 4895 },
  { id: "B-2385", skuId: "sku-005", skuName: "Quinacridone Magenta", stage: "Washing", completionPercentage: 40, throughputRate: 300, yieldLossPercentage: 3.5, machineStatus: "Warning", startedAt: new Date(Date.now() - 3600000 * 12).toISOString(), estimatedCompletion: new Date(Date.now() + 3600000 * 8).toISOString(), priority: "High", inputKg: 1000, outputKg: 965 },
  { id: "B-2381", skuId: "sku-012", skuName: "Hansa Brilliant Yellow", stage: "Drying", completionPercentage: 75, throughputRate: 200, yieldLossPercentage: 1.8, machineStatus: "Running", startedAt: new Date(Date.now() - 3600000 * 18).toISOString(), estimatedCompletion: new Date(Date.now() + 3600000 * 3).toISOString(), priority: "Normal", inputKg: 1500, outputKg: 1473 },
  { id: "B-2379", skuId: "sku-010", skuName: "Titanium Dioxide Rutile", stage: "Drying", completionPercentage: 12, throughputRate: 400, yieldLossPercentage: 0.2, machineStatus: "Running", startedAt: new Date(Date.now() - 3600000 * 20).toISOString(), estimatedCompletion: new Date(Date.now() + 3600000 * 14).toISOString(), priority: "Low", inputKg: 10000, outputKg: 9980 },
  { id: "B-2375", skuId: "sku-006", skuName: "Phthalo Blue Alpha", stage: "Finishing", completionPercentage: 90, throughputRate: 800, yieldLossPercentage: 0.5, machineStatus: "Running", startedAt: new Date(Date.now() - 3600000 * 28).toISOString(), estimatedCompletion: new Date(Date.now() + 1800000).toISOString(), priority: "Normal", inputKg: 6000, outputKg: 5970 },
  { id: "B-2372", skuId: "sku-014", skuName: "DPP Red (Ferrari)", stage: "Finishing", completionPercentage: 0, throughputRate: 150, yieldLossPercentage: 0, machineStatus: "Idle", startedAt: new Date(Date.now() - 3600000 * 30).toISOString(), estimatedCompletion: new Date(Date.now() + 3600000 * 12).toISOString(), priority: "High", inputKg: 500, outputKg: 500 }
];

export const MOCK_RAW_MATERIALS: RawMaterialStock[] = [
  { id: "RM-01", materialName: "Dichlorobenzidine (DCB)", grade: "Premium", stockKg: 850, reorderPoint: 1000, daysUntilStockout: 4, supplier: "ChemSynth Global", lastPricePerKg: 12.50, status: "Low" },
  { id: "RM-02", materialName: "Dichlorobenzidine (DCB)", grade: "Standard", stockKg: 5400, reorderPoint: 2000, daysUntilStockout: 18, supplier: "ChemSynth Global", lastPricePerKg: 7.20, status: "Healthy" },
  { id: "RM-03", materialName: "Acetoacetanilide (AMX)", grade: "Premium", stockKg: 420, reorderPoint: 800, daysUntilStockout: 2, supplier: "OrgChem Industries", lastPricePerKg: 18.00, status: "Critical" },
  { id: "RM-04", materialName: "Acetoacetanilide (AMX)", grade: "Standard", stockKg: 3200, reorderPoint: 1500, daysUntilStockout: 14, supplier: "OrgChem Industries", lastPricePerKg: 9.50, status: "Healthy" },
  { id: "RM-05", materialName: "Titanium Dioxide", grade: "Rutile", stockKg: 18000, reorderPoint: 5000, daysUntilStockout: 45, supplier: "Kronos Titan", lastPricePerKg: 2.80, status: "Healthy" },
  { id: "RM-06", materialName: "Sodium Nitrite", grade: "Industrial", stockKg: 1200, reorderPoint: 1000, daysUntilStockout: 5, supplier: "BasicChem Co", lastPricePerKg: 1.10, status: "Low" },
  { id: "RM-07", materialName: "Hydrochloric Acid (30%)", grade: "Industrial", stockKg: 8400, reorderPoint: 3000, daysUntilStockout: 28, supplier: "BasicChem Co", lastPricePerKg: 0.40, status: "Healthy" }
];

export const MOCK_THROUGHPUT_DATA: ThroughputData[] = Array.from({ length: 30 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  return {
    date: d.toISOString().split('T')[0].slice(5), // MM-DD
    "Azo Yellow": Math.floor(Math.random() * 2000) + 1000,
    "Azo Red": Math.floor(Math.random() * 1500) + 800,
    "Phthalocyanine": Math.floor(Math.random() * 3000) + 2000,
    "Others": Math.floor(Math.random() * 1000) + 200
  };
});

export const MOCK_YIELD_LOSS_TREND: YieldLossData[] = Array.from({ length: 12 }).map((_, i) => ({
  week: `W${i+1}`,
  Precipitation: parseFloat((Math.random() * 1.5 + 0.5).toFixed(1)),
  FilterPress: parseFloat((Math.random() * 2.5 + 1.0).toFixed(1)),
  Washing: parseFloat((Math.random() * 4.0 + 2.0).toFixed(1)),
  Drying: parseFloat((Math.random() * 2.0 + 0.5).toFixed(1)),
  Finishing: parseFloat((Math.random() * 1.0 + 0.2).toFixed(1))
}));

export const MOCK_SIMULATIONS: SimulatedOrder[] = [
  { id: "SIM-8492", customerName: "AkzoNobel", industry: "Paints", pigmentFamily: "Azo Yellow", skuId: "sku-002", quantityRequired: 4000, deliveryDate: new Date(Date.now() + 86400000 * 14).toISOString(), qualityTier: "Premium", estimatedRawMaterialCost: 38000, estimatedProductionTime: 48, suggestedPricePerKg: 14.50, feasibility: "GREEN", competingOrdersWarning: null, specifications: [] }
];
