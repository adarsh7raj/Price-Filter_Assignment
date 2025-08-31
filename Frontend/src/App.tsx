import React, { useState, useEffect } from "react";
import { fetchCombined } from "./services/priceApis";
import type { Product } from "./services/priceApis";
import ProductCard from "./components/ProductCard";

function App() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    const timer = setTimeout(async () => {
      setLoading(true);
      const data = await fetchCombined(query);
      setProducts(data);
      setLoading(false);
    }, 800); // wait 800ms after user stops typing

    return () => clearTimeout(timer); // cancel previous timer on each keystroke
  }, [query]);

  return (
    <div className="app">
      <h1>💰 Price Compare</h1>
      <p>Compare Amazon & Flipkart prices instantly</p>

      <input
        type="text"
        placeholder="Search for a product..."
        value={query}
        onChange={(e) => setQuery(e.target.value)} // just update state
      />

      {loading && <p>Loading...</p>}

      <div className="grid">
        {products.map((p, i) => (
          <ProductCard key={i} rank={i+1} product={p} />
        ))}
      </div>
    </div>
  );
}

export default App;
