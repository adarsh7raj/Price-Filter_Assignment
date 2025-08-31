import React from "react";
import type { Product } from "../services/priceApis";


interface Props {
  product: Product;
  rank: number;
  id?: string;
}

const ProductCard: React.FC<Props> = ({ rank, product, id }) => {
  return (
    <div className="product-card">
      {/* 🔹 Source Ribbon (Amazon / Flipkart) */}
      <div
        className={`source-ribbon ${
          product.source.toLowerCase() === "amazon"
            ? "amazon"
            : "flipkart"
        }`}
      >
        {product.source}
      </div>

      {/* 🔹 Rank Badge */}
      <div className="rank-badge">#{rank}</div>

      {/* Product Image */}
      <img
        src={product.image}
        alt={product.title}
        className="product-image"
      />

      {/* Product Title */}
      <h3 className="product-title">{product.title}</h3>

      {/* Price */}
      <p className="product-price">
        {product.currency} {product.price}
      </p>

      {/* Buy Now Button */}
      <a href={product.url} target="_blank" rel="noreferrer">
        <button className="buy-btn">Buy Now</button>
      </a>
    </div>
  );
};

export default ProductCard;
