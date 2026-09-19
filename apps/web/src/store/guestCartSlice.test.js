import { describe, it, expect, beforeEach, vi } from "vitest";
import guestCartReducer, {
  addGuestItem,
  updateGuestQuantity,
  removeGuestItem,
  clearGuestCart,
} from "./guestCartSlice";

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

describe("guestCartSlice", () => {
  const sampleProduct = { _id: "p1", name: "Widget", price: 100 };

  beforeEach(() => {
    localStorage.clear();
  });

  it("adds a new item to an empty cart", () => {
    const state = guestCartReducer(
      { items: [] },
      addGuestItem({ productId: "p1", quantity: 1, product: sampleProduct }),
    );

    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toMatchObject({ productId: "p1", quantity: 1 });
  });

  it("increments quantity when adding an item that already exists", () => {
    const initialState = {
      items: [{ productId: "p1", quantity: 2, product: sampleProduct }],
    };

    const state = guestCartReducer(
      initialState,
      addGuestItem({ productId: "p1", quantity: 3, product: sampleProduct }),
    );

    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(5);
  });

  it("persists to localStorage after adding an item", () => {
    guestCartReducer(
      { items: [] },
      addGuestItem({ productId: "p1", quantity: 1, product: sampleProduct }),
    );

    const stored = JSON.parse(localStorage.getItem("guestCart"));
    expect(stored).toHaveLength(1);
    expect(stored[0].productId).toBe("p1");
  });

  it("updates quantity for an existing item", () => {
    const initialState = {
      items: [{ productId: "p1", quantity: 2, product: sampleProduct }],
    };

    const state = guestCartReducer(
      initialState,
      updateGuestQuantity({ productId: "p1", quantity: 10 }),
    );

    expect(state.items[0].quantity).toBe(10);
  });

  it("does nothing if updating quantity for a nonexistent item", () => {
    const initialState = {
      items: [{ productId: "p1", quantity: 2, product: sampleProduct }],
    };

    const state = guestCartReducer(
      initialState,
      updateGuestQuantity({ productId: "does-not-exist", quantity: 99 }),
    );

    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(2);
  });

  it("removes an item by productId", () => {
    const initialState = {
      items: [
        { productId: "p1", quantity: 1, product: sampleProduct },
        { productId: "p2", quantity: 1, product: sampleProduct },
      ],
    };

    const state = guestCartReducer(initialState, removeGuestItem("p1"));

    expect(state.items).toHaveLength(1);
    expect(state.items[0].productId).toBe("p2");
  });

  it("clears all items and localStorage", () => {
    localStorage.setItem("guestCart", JSON.stringify([{ productId: "p1" }]));
    const initialState = {
      items: [{ productId: "p1", quantity: 1, product: sampleProduct }],
    };

    const state = guestCartReducer(initialState, clearGuestCart());

    expect(state.items).toHaveLength(0);
    expect(localStorage.getItem("guestCart")).toBeNull();
  });
});