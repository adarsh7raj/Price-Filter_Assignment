import React from "react";
import type { Product } from "../services/priceApis";

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  return (
    <div className="card">
      <img src={product.image} alt={product.title} />
      <h3>{product.title}</h3>
      <p>
        <strong>
          {product.currency} {product.price}
        </strong>
      </p>
      <span className="tag">{product.source}</span>
      <a href={product.url} target="_blank" rel="noreferrer">
        <button>Buy Now</button>
      </a>
    </div>
  );
};

export default ProductCard;
