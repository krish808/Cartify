import { describe, it, expect, vi, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import checkoutReducer, { checkout, resetCheckoutState } from "./checkoutSlice";

vi.mock("../services/checkoutService.js", () => ({
  placeOrder: vi.fn(),
}));

import { placeOrder } from "../services/checkoutService.js";

const buildStore = () =>
  configureStore({ reducer: { checkout: checkoutReducer } });

describe("checkoutSlice", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sets loading true while checkout is pending", () => {
    const state = checkoutReducer(undefined, { type: checkout.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it("stores orders and payments on successful checkout", () => {
    const payload = {
      orders: [{ _id: "o1", totalAmount: 100 }],
      payments: [{ _id: "p1", status: "PENDING" }],
    };

    const state = checkoutReducer(undefined, {
      type: checkout.fulfilled.type,
      payload,
    });

    expect(state.loading).toBe(false);
    expect(state.lastOrders).toEqual(payload.orders);
    expect(state.lastPayments).toEqual(payload.payments);
  });

  it("stores the error message on failed checkout", () => {
    const state = checkoutReducer(undefined, {
      type: checkout.rejected.type,
      payload: "Cart is empty",
    });

    expect(state.loading).toBe(false);
    expect(state.error).toBe("Cart is empty");
  });

  it("resets state via resetCheckoutState", () => {
    const dirtyState = {
      loading: true,
      error: "some error",
      lastOrders: [{ _id: "o1" }],
      lastPayments: [{ _id: "p1" }],
    };

    const state = checkoutReducer(dirtyState, resetCheckoutState());

    expect(state).toEqual({
      loading: false,
      error: null,
      lastOrders: [],
      lastPayments: [],
    });
  });

  it("calls placeOrder with the coupon code when dispatched", async () => {
    placeOrder.mockResolvedValue({ orders: [], payments: [] });

    const store = buildStore();
    await store.dispatch(checkout("SAVE10"));

    expect(placeOrder).toHaveBeenCalledWith("SAVE10");
  });

  it("passes rejectWithValue's message through on API failure", async () => {
    placeOrder.mockRejectedValue({
      response: { data: { message: "Insufficient stock for Widget" } },
    });

    const store = buildStore();
    await store.dispatch(checkout());

    expect(store.getState().checkout.error).toBe("Insufficient stock for Widget");
  });
});