export type Source = "Amazon" | "Flipkart";

export interface Product {
  id: string;
  title: string;
  image: string;
  price: number;
  currency: string; // e.g. ₹
  link: string;
  source: Source;
  rating?: number;
}
