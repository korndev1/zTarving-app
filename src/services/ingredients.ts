import axios from "axios";
import { BASE_URL } from "../../appsetting";

const API = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

export const IngredientService = {
    getMeasure: async () => {
        try {
            const response = await API.get("/ingredients/measure");
            return response;
          } catch (error: any) {
            throw error.response?.data || { message: "Something went wrong" };
          }
    }
}