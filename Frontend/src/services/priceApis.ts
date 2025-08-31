import axios from "axios";

export interface Product {
  title: string;
  price: number;
  currency: string;
  image: string;
  url: string;
  source: "Amazon" | "Flipkart";
}

// Call backend instead of Oxylabs directly
export async function fetchCombined(query: string): Promise<Product[]> {
  try {
    const res = await axios.get("http://localhost:5000/api/products", {
      params: { q: query },
    });
    console.log(res.data);
    return res.data as Product[];
  } catch (err) {
    console.error("Fetch error:", err);
    return [];
  }
}
