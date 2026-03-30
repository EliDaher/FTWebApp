import apiClient from "../lib/axios";
import { Plan } from "../types/plans";

export default async function getAllPlans() {

    try {
      const response = await apiClient.get("/getAllPlans");

      return response.data
      
    } catch (err) {
      console.error("خطأ في تسجيل الدخول:", err);
   
    }

}

export async function createPlan({ key, name, duration, price, description, currency }: Plan) {

    try {

      const response = await apiClient.post("/createPlan", { key, name, duration, price, description, currency });

      return response.data
      
    } catch (err) {
      console.error("خطأ في تسجيل الدخول:", err);
   
    }

}

export async function deletePlan({ key }: any) {

    try {
      console.log(key)
      const response = await apiClient.delete(`/deletePlan/${key}`);

      return response.data
      
    } catch (err) {
      console.error("خطأ في تسجيل الدخول:", err);
   
    }

}
