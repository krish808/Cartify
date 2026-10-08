import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import Products from "./Products";

const sampleProducts = [
  {
    _id: "p1",
    name: "Wireless Headphones",
    category: "Electronics",
    price: 1500,
  },
  {
    _id: "p2",
    name: "Ruled Notebook",
    category: "Books & Stationery",
    price: 200,
  },
  {
    _id: "p3",
    name: "Steel Water Bottle",
    category: "Home & Kitchen",
    price: 600,
  },
];

const renderProducts = (initialEntry) => {
  const store = configureStore({
    reducer: {
      products: () => ({ items: sampleProducts, loading: false, error: null }),
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Products />
      </MemoryRouter>
    </Provider>,
  );
};

describe("Products page filtering", () => {
  it("shows all products with no filters applied", () => {
    renderProducts("/products");

    expect(screen.getByText("Wireless Headphones")).toBeInTheDocument();
    expect(screen.getByText("Ruled Notebook")).toBeInTheDocument();
    expect(screen.getByText("Steel Water Bottle")).toBeInTheDocument();
  });

  it("filters by search query", () => {
    renderProducts("/products?search=headphones");

    expect(screen.getByText("Wireless Headphones")).toBeInTheDocument();
    expect(screen.queryByText("Ruled Notebook")).not.toBeInTheDocument();
  });

  it("filters by category", () => {
    renderProducts("/products?category=Electronics");

    expect(screen.getByText("Wireless Headphones")).toBeInTheDocument();
    expect(screen.queryByText("Ruled Notebook")).not.toBeInTheDocument();
  });

  it("filters by min and max price using the 'min'/'max' param names", () => {
    // ✅ this is the exact regression check for the min/max vs
    // minPrice/maxPrice mismatch bug we just fixed
    renderProducts("/products?min=500&max=1000");

    expect(screen.getByText("Steel Water Bottle")).toBeInTheDocument();
    expect(screen.queryByText("Wireless Headphones")).not.toBeInTheDocument();
    expect(screen.queryByText("Ruled Notebook")).not.toBeInTheDocument();
  });

  it("shows an empty state when no products match", () => {
    renderProducts("/products?search=nonexistentproduct");

    expect(screen.getByText("No products found")).toBeInTheDocument();
  });
});
