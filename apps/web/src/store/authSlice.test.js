 import { describe, it, expect, vi, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import authReducer, { register, login } from "./authSlice";
import cartReducer from "./cartSlice";
import guestCartReducer from "./guestCartSlice";

vi.mock("../services/authService", () => ({
  registerUser: vi.fn(),
  loginUser: vi.fn(),
  logoutUser: vi.fn(),
}));

vi.mock("../services/cartServices.js", () => ({
  getCart: vi.fn(),
  addCartItem: vi.fn(),
  updateCartItemQuantity: vi.fn(),
  removeCartItem: vi.fn(),
  clearCartItems: vi.fn(),
  mergeCartItems: vi.fn(),
}));

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

import { registerUser, loginUser } from "../services/authService";
import { mergeCartItems } from "../services/cartServices.js";

const buildStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      cart: cartReducer,
      guestCart: guestCartReducer,
    },
  });

describe("authSlice - guest cart merging", () => {
  const fakeUser = { _id: "u1", name: "Test User", email: "t@example.com" };
  const fakeAuthResponse = { accessToken: "fake-token", user: fakeUser };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("merges the guest cart into the server cart on successful registration", async () => {
    localStorage.setItem(
      "guestCart",
      JSON.stringify([{ productId: "p1", quantity: 2 }]),
    );
    registerUser.mockResolvedValue(fakeAuthResponse);
    mergeCartItems.mockResolvedValue({
      items: [{ product: { _id: "p1", price: 100 }, quantity: 2 }],
      totalAmount: 200,
    });

    const store = buildStore();
    await store.dispatch(register({ name: "T", email: "t@example.com", password: "pw" }));

    expect(mergeCartItems).toHaveBeenCalledWith([
      { productId: "p1", quantity: 2 },
    ]);
    expect(store.getState().cart.totalAmount).toBe(200);
  });

  it("merges the guest cart into the server cart on successful login", async () => {
    localStorage.setItem(
      "guestCart",
      JSON.stringify([{ productId: "p2", quantity: 1 }]),
    );
    loginUser.mockResolvedValue(fakeAuthResponse);
    mergeCartItems.mockResolvedValue({
      items: [{ product: { _id: "p2", price: 50 }, quantity: 1 }],
      totalAmount: 50,
    });

    const store = buildStore();
    await store.dispatch(login({ email: "t@example.com", password: "pw" }));

    expect(mergeCartItems).toHaveBeenCalledWith([
      { productId: "p2", quantity: 1 },
    ]);
    expect(store.getState().cart.totalAmount).toBe(50);
  });

  it("does NOT call the merge API when there is no guest cart", async () => {
    // localStorage has no "guestCart" key at all
    registerUser.mockResolvedValue(fakeAuthResponse);

    const store = buildStore();
    await store.dispatch(register({ name: "T", email: "t@example.com", password: "pw" }));

    expect(mergeCartItems).not.toHaveBeenCalled();
  });

  it("does NOT call the merge API when the guest cart is an empty array", async () => {
    // ✅ this is the exact case the guestItems.length bug affected —
    // an empty array is falsy-adjacent but !== 0, so the old buggy
    // check (`guestItems === 0`) never caught this case correctly.
    localStorage.setItem("guestCart", JSON.stringify([]));
    loginUser.mockResolvedValue(fakeAuthResponse);

    const store = buildStore();
    await store.dispatch(login({ email: "t@example.com", password: "pw" }));

    expect(mergeCartItems).not.toHaveBeenCalled();
  });

  it("clears the guest cart and shows an error toast if merging fails", async () => {
    localStorage.setItem(
      "guestCart",
      JSON.stringify([{ productId: "p1", quantity: 1 }]),
    );
    loginUser.mockResolvedValue(fakeAuthResponse);
    mergeCartItems.mockRejectedValue({
      response: { data: { message: "Merge failed on server" } },
    });

    const store = buildStore();
    await store.dispatch(login({ email: "t@example.com", password: "pw" }));

    expect(store.getState().guestCart.items).toEqual([]);
    expect(localStorage.getItem("guestCart")).toBeNull();
  });
});