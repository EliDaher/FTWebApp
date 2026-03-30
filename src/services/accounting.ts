import apiClient from "../lib/axios";
import { BillingSummary, BillingSummaryRow, Payment, Subscription } from "../types/accounting";

export async function getAllBillingSummary() {
  const response = await apiClient.get<BillingSummaryRow[]>("/getAllBillingSummary");
  return response.data;
}

export async function createSubscription(payload: {
  userId: string;
  planKey: string;
  startDate?: string;
  currency?: string;
}) {
  const response = await apiClient.post<{ subscription: Subscription; summary: BillingSummary }>(
    "/createSubscription",
    payload
  );
  return response.data;
}

export async function getSubscriptionsByUser(userId: string) {
  const response = await apiClient.get<Record<string, Subscription>>(`/getSubscriptionsByUser/${userId}`);
  return Object.values(response.data || {});
}

export async function getUserBillingSummary(userId: string) {
  const response = await apiClient.get<BillingSummary>(`/getUserBillingSummary/${userId}`);
  return response.data;
}

export async function addPayment(
  subId: string,
  payload: {
    amount: number;
    method: string;
    note?: string;
    currency?: string;
  }
) {
  const response = await apiClient.post(`/addPayment/${subId}/payments`, payload);
  return response.data;
}

export async function renewSubscription(subId: string) {
  const response = await apiClient.post(`/renewSubscription/${subId}`);
  return response.data;
}

export async function deleteSubscription(subId: string) {
  const response = await apiClient.delete(`/deleteSubscription/${subId}`);
  return response.data;
}

export async function getSubscriptionPayments(subId: string) {
  const response = await apiClient.get<{ subscription: Subscription; payments: Payment[] }>(
    `/getSubscriptionPayments/${subId}`
  );
  return response.data;
}
