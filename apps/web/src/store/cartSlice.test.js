import { describe, it, expect } from "vitest";
import cartReducer, {
  fetchCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCartState,
  mergeCart,
} from "./cartSlice";

const initialState = {
  items: [],
  totalAmount: 0,
  loading: false,
  actionLoading: false,
  error: null,
};

const sampleItem = (id, price, quantity) => ({
  product: { _id: id, price },
  quantity,
});

describe("cartSlice", () => {
  it("sets loading true on fetchCart.pending", () => {
    const state = cartReducer(initialState, { type: fetchCart.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it("populates items and totalAmount from the server on fetchCart.fulfilled", () => {
    const payload = {
      items: [sampleItem("p1", 100, 2)],
      totalAmount: 200,
    };

    const state = cartReducer(initialState, {
      type: fetchCart.fulfilled.type,
      payload,
    });

    expect(state.loading).toBe(false);
    expect(state.items).toEqual(payload.items);
    expect(state.totalAmount).toBe(200);
  });

  it("stores the error message on fetchCart.rejected", () => {
    const state = cartReducer(initialState, {
      type: fetchCart.rejected.type,
      payload: "Failed to fetch cart",
    });

    expect(state.loading).toBe(false);
    expect(state.error).toBe("Failed to fetch cart");
  });

  it("uses actionLoading (not loading) for addToCart", () => {
    const pendingState = cartReducer(initialState, {
      type: addToCart.pending.type,
    });
    expect(pendingState.actionLoading).toBe(true);
    expect(pendingState.loading).toBe(false);
  });

  it("updates items after updateQuantity.fulfilled", () => {
    const payload = { items: [sampleItem("p1", 50, 5)], totalAmount: 250 };

    const state = cartReducer(initialState, {
      type: updateQuantity.fulfilled.type,
      payload,
    });

    expect(state.items).toEqual(payload.items);
    expect(state.totalAmount).toBe(250);
  });

  it("replaces items and totalAmount with the server's response on removeFromCart.fulfilled", () => {
    const startState = {
      ...initialState,
      items: [sampleItem("p1", 100, 1), sampleItem("p2", 50, 2)],
      totalAmount: 200,
    };

    const serverResponse = {
      items: [sampleItem("p2", 50, 2)],
      totalAmount: 100,
    };

    const state = cartReducer(startState, {
      type: removeFromCart.fulfilled.type,
      payload: serverResponse,
    });

    expect(state.items).toEqual(serverResponse.items);
    expect(state.totalAmount).toBe(100);
  });

  it("replaces items and totalAmount on mergeCart.fulfilled", () => {
    const payload = { items: [sampleItem("p1", 100, 3)], totalAmount: 300 };

    const state = cartReducer(initialState, {
      type: mergeCart.fulfilled.type,
      payload,
    });

    expect(state.items).toEqual(payload.items);
    expect(state.totalAmount).toBe(300);
  });



  it("resets items and totalAmount on clearCartState.fulfilled (async thunk)", () => {
    const fullState = {
      ...initialState,
      items: [sampleItem("p1", 100, 1)],
      totalAmount: 100,
    };

    const state = cartReducer(fullState, {
      type: clearCartState.fulfilled.type,
    });

    expect(state.items).toEqual([]);
    expect(state.totalAmount).toBe(0);
  });
});