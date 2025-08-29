import type { Product } from "../types";

export const mockResults = (q: string): Product[] => {
  // Simple mock to see UI without API keys
  const base = q[0]?.toUpperCase() + q.slice(1);
  return [
    {
      id: "amz-1",
      title: `${base} — 128GB (Black)`,
      image: "https://dummyimage.com/300x300/0f0f17/ffffff&text=Amazon",
      price: 59999,
      currency: "₹",
      link: "https://www.amazon.in/",
      source: "Amazon",
      rating: 4.5,
    },
    {
      id: "fk-1",
      title: `${base} — 128GB (Black)`,
      image: "https://dummyimage.com/300x300/0f0f17/ffffff&text=Flipkart",
      price: 58999,
      currency: "₹",
      link: "https://www.flipkart.com/",
      source: "Flipkart",
      rating: 4.4,
    },
    {
      id: "amz-2",
      title: `${base} — 256GB (Blue)`,
      image: "https://dummyimage.com/300x300/0f0f17/ffffff&text=Amazon",
      price: 69999,
      currency: "₹",
      link: "https://www.amazon.in/",
      source: "Amazon",
      rating: 4.6,
    },
    {
      id: "fk-2",
      title: `${base} — 256GB (Blue)`,
      image: "https://dummyimage.com/300x300/0f0f17/ffffff&text=Flipkart",
      price: 68999,
      currency: "₹",
      link: "https://www.flipkart.com/",
      source: "Flipkart",
      rating: 4.5,
    },
  ];
};
