import apiClient from "../lib/axios";
import {
  AddInventoryMovementPayload,
  CreateInventoryItemPayload,
  GetInventoryItemsFilters,
  GetInventoryAccountingSummaryFilters,
  InventoryAccountingSummary,
  InventoryItem,
  InventoryMovement,
  InventorySummary,
  UpdateInventoryItemPayload,
} from "../types/inventory";

export async function getInventoryItems(filters: GetInventoryItemsFilters = {}) {
  const response = await apiClient.get<{ items: InventoryItem[] }>("/getInventoryItems", {
    params: filters,
  });
  return response.data.items || [];
}

export async function createInventoryItem(payload: CreateInventoryItemPayload) {
  const response = await apiClient.post<{ item: InventoryItem }>("/createInventoryItem", payload);
  return response.data.item;
}

export async function updateInventoryItem(itemId: string, payload: UpdateInventoryItemPayload) {
  const response = await apiClient.put<{ item: InventoryItem }>(`/updateInventoryItem/${itemId}`, payload);
  return response.data.item;
}

export async function addInventoryMovement(itemId: string, payload: AddInventoryMovementPayload) {
  const response = await apiClient.post<{ item: InventoryItem; movement: InventoryMovement }>(
    `/addInventoryMovement/${itemId}/movements`,
    payload
  );
  return response.data;
}

export async function getInventoryMovements(itemId: string, limit = 50) {
  const response = await apiClient.get<{ item: InventoryItem; movements: InventoryMovement[] }>(
    `/getInventoryMovements/${itemId}`,
    {
      params: { limit },
    }
  );
  return response.data;
}

export async function getInventorySummary(filters: { currency?: string } = {}) {
  const response = await apiClient.get<InventorySummary>("/getInventorySummary", {
    params: filters,
  });
  return response.data;
}

export async function getInventoryAccountingSummary(filters: GetInventoryAccountingSummaryFilters = {}) {
  const response = await apiClient.get<InventoryAccountingSummary>("/getInventoryAccountingSummary", {
    params: filters,
  });
  return response.data;
}
