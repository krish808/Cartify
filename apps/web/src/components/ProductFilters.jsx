import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function ProductFilters({ categories }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category") || "";
  const minParam = searchParams.get("min") || "";
  const maxParam = searchParams.get("max") || "";

  const [category, setCategory] = useState(categoryParam);

  const [min, setMin] = useState(minParam);
  const [max, setMax] = useState(maxParam);

  useEffect(() => {
    setCategory(categoryParam);
    setMin(minParam);
    setMax(maxParam);
  }, [categoryParam, minParam, maxParam]);

  const applyFilters = () => {
    setSearchParams({
      search,
      category,
      min,
      max,
    });
  };

  return (
    <div className="w-64 space-y-6">
      <h2 className="font-bold text-lg">Filters</h2>

      {/* Category */}
      <div>
        <h3 className="font-semibold">Category</h3>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-2 mt-2"
        >
          <option value="">All</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div>
        <h3 className="font-semibold">Price</h3>
        <div className="flex gap-2 mt-2">
          <input
            type="number"
            placeholder="Min"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            className="w-full border p-2"
          />
          <input
            type="number"
            placeholder="Max"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            className="w-full border p-2"
          />
        </div>
      </div>

      <button
        onClick={applyFilters}
        className="w-full bg-black text-white py-2"
      >
        Apply Filters
      </button>
    </div>
  );
}
