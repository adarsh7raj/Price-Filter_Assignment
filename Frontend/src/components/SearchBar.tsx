import { useState } from "react";

export default function SearchBar({
  onSearch,
  loading,
}: {
  onSearch: (q: string) => void;
  loading: boolean;
}) {
  const [q, setQ] = useState("");

  return (
    <div className="search">
      <input
        className="input"
        placeholder="Search product (e.g., iPhone 15, laptop, headphones)"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && q.trim() && onSearch(q.trim())}
        disabled={loading}
      />
      <button
        className="button"
        onClick={() => q.trim() && onSearch(q.trim())}
        disabled={loading}
      >
        {loading ? "Searching…" : "Search"}
      </button>
    </div>
  );
}
