import React, { useState } from "react";
import { fetchCombined } from "./services/priceApis";
import type { Product } from "./services/priceApis";
import ProductCard from "./components/ProductCard";


const debounce = (fn: Function, delay: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

function App() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const searchProducts = async (q: string) => {
    if (!q) return;
    setLoading(true);
    const data = await fetchCombined(q);
    setProducts(data);
    setLoading(false);
  };

  const handleSearch = debounce(searchProducts, 800);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    handleSearch(e.target.value);
  };

  return (
    <div className="app">
      <h1>💰 Price Compare</h1>
      <p>Compare Amazon & Flipkart prices instantly</p>

      <input
        type="text"
        placeholder="Search for a product..."
        value={query}
        onChange={onChange}
      />

      {loading && <p>Loading...</p>}

      <div className="grid">
        {products.map((p, i) => (
          <ProductCard key={i} product={p} />
        ))}
      </div>
    </div>
  );
}

export default App;
