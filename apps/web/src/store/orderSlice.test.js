import { describe, it, expect, vi, beforeEach } from "vitest";
import orderReducer, { fetchMyOrders } from "./orderSlice";

vi.mock("../services/orderService.js", () => ({
  getMyOrders: vi.fn(),
}));

import { getMyOrders } from "../services/orderService.js";

describe("orderSlice", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sets loading true while fetchMyOrders is pending", () => {
    const state = orderReducer(undefined, { type: fetchMyOrders.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it("stores the orders on successful fetch", () => {
    const payload = [
      { _id: "o1", totalAmount: 100, items: [] },
      { _id: "o2", totalAmount: 200, items: [] },
    ];

    const state = orderReducer(undefined, {
      type: fetchMyOrders.fulfilled.type,
      payload,
    });

    expect(state.loading).toBe(false);
    expect(state.items).toEqual(payload);
  });

  it("stores the error message on failed fetch", () => {
    const state = orderReducer(undefined, {
      type: fetchMyOrders.rejected.type,
      payload: "Failed to fetch orders",
    });

    expect(state.loading).toBe(false);
    expect(state.error).toBe("Failed to fetch orders");
  });

  it("calls getMyOrders when the thunk is dispatched", async () => {
    getMyOrders.mockResolvedValue([]);

    const { configureStore } = await import("@reduxjs/toolkit");
    const store = configureStore({ reducer: { orders: orderReducer } });

    await store.dispatch(fetchMyOrders());

    expect(getMyOrders).toHaveBeenCalled();
  });
});