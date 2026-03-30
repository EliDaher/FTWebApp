import apiClient from "../lib/axios";
import { GetProjectBalanceReportParams, ProjectBalanceReportResponse } from "../types/balance";

export async function getProjectBalanceReport(params: GetProjectBalanceReportParams = {}) {
  const response = await apiClient.get<ProjectBalanceReportResponse>("/getProjectBalanceReport", {
    params,
  });
  return response.data;
}
