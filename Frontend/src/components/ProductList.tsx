import type { Product } from "../types";
import ProductCard from "./ProductCard";

export default function ProductList({
  products,
  loading,
}: {
  products: Product[];
  loading: boolean;
}) {
  if (loading) {
    return <div className="empty">Fetching prices…</div>;
  }
  return (
    <div className="grid">
      {products.map((p) => (
        <ProductCard key={p.id} p={p} />
      ))}
    </div>
  );
}
