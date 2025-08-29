// src/services/priceApis.ts
import axios from "axios";

export const fetchCombined = async (query: string) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/compare`, {
      params: { query },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching combined data:", error);
    throw error;
  }
};
