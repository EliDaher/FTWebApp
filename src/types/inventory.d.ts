export type InventoryMovementType = "in" | "out" | "adjust";
export type InventoryMovementClass = "purchase" | "sale" | "adjustment" | "waste" | "return";

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  currency: string;
  costPrice: number;
  sellPrice: number | null;
  avgUnitCost: number;
  stockValue: number;
  quantityOnHand: number;
  lowStockThreshold: number;
  isActive: boolean;
  isLowStock?: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface InventoryMovement {
  id: string;
  itemId: string;
  type: InventoryMovementType;
  movementClass: InventoryMovementClass;
  quantity: number;
  unitCost: number | null;
  unitSalePrice: number | null;
  reason: string;
  note: string;
  currency: string;
  balanceBefore: number;
  balanceAfter: number;
  stockValueBefore: number;
  stockValueAfter: number;
  avgCostBefore: number;
  avgCostAfter: number;
  purchaseAmount: number;
  revenueAmount: number;
  cogsAmount: number;
  grossProfit: number;
  linkedUserId?: string | null;
  linkedSubscriptionId?: string | null;
  createdBy: string;
  createdAt: string;
}

export interface InventorySummary {
  totalItems: number;
  lowStockItems: number;
  totalOnHandUnits: number;
  totalStockValue: number;
}

export interface InventoryAccountingSummary {
  from: string | null;
  to: string | null;
  currency: string | null;
  category: string | null;
  totalItems: number;
  lowStockItems: number;
  currentInventoryValue: number;
  totalPurchasesValue: number;
  totalCogs: number;
  totalRevenue: number;
  totalGrossProfit: number;
  movementsCount: number;
  salesCount: number;
  purchasesCount: number;
  isMixedCurrency: boolean;
  currencyBreakdown: Record<string, { stockValue: number; totalItems: number }>;
}

export interface GetInventoryItemsFilters {
  search?: string;
  category?: string;
  lowStock?: boolean;
  currency?: string;
}

export interface GetInventoryAccountingSummaryFilters {
  from?: string;
  to?: string;
  currency?: string;
  category?: string;
}

export interface CreateInventoryItemPayload {
  sku: string;
  name: string;
  category?: string;
  unit?: string;
  currency?: string;
  costPrice?: number;
  sellPrice?: number | null;
  avgUnitCost?: number;
  quantityOnHand?: number;
  lowStockThreshold?: number;
  isActive?: boolean;
}

export interface UpdateInventoryItemPayload {
  sku?: string;
  name?: string;
  category?: string;
  unit?: string;
  currency?: string;
  costPrice?: number;
  sellPrice?: number | null;
  avgUnitCost?: number;
  quantityOnHand?: number;
  lowStockThreshold?: number;
  isActive?: boolean;
}

export interface AddInventoryMovementPayload {
  type: InventoryMovementType;
  movementClass?: InventoryMovementClass;
  quantity: number;
  unitCost?: number | null;
  unitSalePrice?: number | null;
  reason: string;
  note?: string;
  currency?: string;
  linkedUserId?: string | null;
  linkedSubscriptionId?: string | null;
}
